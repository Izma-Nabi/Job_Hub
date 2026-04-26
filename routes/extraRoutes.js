// extraRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// ===========================
// Middleware: Verify JWT Token
// ===========================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token not provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verify error:", err.message);
      return res.status(401).json({ message: "Invalid token", error: err.message });
    }
    req.user = decoded; // { id, role }
    next();
  });
}

// ======================================================
// 1️⃣ GET ALL JOBS POSTED BY LOGGED-IN COMPANY
// Route: GET /api/company/:companyId/jobs
// ======================================================
router.get("/company/:companyId/jobs", verifyToken, async (req, res) => {
  const requestedCompanyId = parseInt(req.params.companyId);

  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied: not a company" });
  }

  if (req.user.id !== requestedCompanyId) {
    return res.status(403).json({ message: "Access denied: cannot view other company jobs" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("companyId", sql.Int, requestedCompanyId)
      .query(`
        SELECT JobID, Title, Description, Requirements, Location, SalaryRange, EmploymentType, Deadline, PostedAt, IsActive
        FROM Jobs
        WHERE CompanyID = @companyId
        ORDER BY PostedAt DESC
      `);

    res.json({ success: true, jobs: result.recordset });
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

// ======================================================
// 2️⃣ GET ALL APPLICATIONS RECEIVED BY COMPANY
// Route: GET /api/company/applications
// ======================================================
router.get("/company/applications", verifyToken, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied: not a company" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("companyId", sql.Int, req.user.id)
      .query(`
        SELECT a.ApplicationID, a.CandidateID, c.FullName AS CandidateName, c.Email AS CandidateEmail,
               a.Status, a.AppliedAt, a.ResumeLink, a.CoverLetter,
               j.JobID, j.Title AS JobTitle
        FROM Applications a
        INNER JOIN Jobs j ON a.JobID = j.JobID
        INNER JOIN Candidates c ON a.CandidateID = c.CandidateID
        WHERE j.CompanyID = @companyId
        ORDER BY a.AppliedAt DESC
      `);

    res.json({ success: true, applications: result.recordset });
  } catch (error) {
    console.error("Error fetching company applications:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

// ======================================================
// 3️⃣ GET ALL APPLICATIONS BY LOGGED-IN CANDIDATE
// Route: GET /api/candidate/:candidateId/applications
// ======================================================
router.get("/candidate/:candidateId/applications", verifyToken, async (req, res) => {
  const requestedCandidateId = parseInt(req.params.candidateId);

  // Only the logged-in candidate can view their own applications
  if (req.user.role !== "candidate") {
    return res.status(403).json({ message: "Access denied: not a candidate" });
  }

  if (req.user.id !== requestedCandidateId) {
    return res.status(403).json({ message: "Access denied: cannot view other candidate applications" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("candidateId", sql.Int, requestedCandidateId)
      .query(`
        SELECT a.ApplicationID, a.JobID, j.Title AS JobTitle, j.CompanyID, comp.CompanyName,
               a.Status, a.AppliedAt, a.ResumeLink, a.CoverLetter
        FROM Applications a
        INNER JOIN Jobs j ON a.JobID = j.JobID
        INNER JOIN Companies comp ON j.CompanyID = comp.CompanyID
        WHERE a.CandidateID = @candidateId
        ORDER BY a.AppliedAt DESC
      `);

    res.json({ success: true, applications: result.recordset });
  } catch (error) {
    console.error("Error fetching candidate applications:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

// ======================================================
// 4️⃣ APPLY TO A JOB (with deadline check)
// Route: POST /api/jobs/:jobId/apply
// ======================================================
router.post("/jobs/:jobId/apply", verifyToken, async (req, res) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({ message: "Access denied: not a candidate" });
  }

  const jobId = parseInt(req.params.jobId);
  const candidateId = req.user.id; // candidate ID from JWT
  const { resumeLink, coverLetter } = req.body;

  try {
    const pool = await poolPromise;

    // 1️⃣ Get job and deadline
    const jobResult = await pool.request()
      .input("jobId", sql.Int, jobId)
      .query("SELECT JobID, Deadline FROM Jobs WHERE JobID = @jobId");

    if (jobResult.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const job = jobResult.recordset[0];

    // 2️⃣ Check deadline
    const today = new Date();
    if (job.Deadline && new Date(job.Deadline) < today) {
      return res.status(400).json({ success: false, message: "Cannot apply — deadline passed" });
    }

    // 3️⃣ Check if already applied
    const existing = await pool.request()
      .input("jobId", sql.Int, jobId)
      .input("candidateId", sql.Int, candidateId)
      .query("SELECT ApplicationID FROM Applications WHERE JobID = @jobId AND CandidateID = @candidateId");

    if (existing.recordset.length > 0) {
      return res.status(400).json({ success: false, message: "Already applied to this job" });
    }

    // 4️⃣ Insert application
    const applyDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    await pool.request()
      .input("jobId", sql.Int, jobId)
      .input("candidateId", sql.Int, candidateId)
      .input("resumeLink", sql.VarChar(300), resumeLink || "")
      .input("coverLetter", sql.VarChar(1000), coverLetter || "")
      .query(`
        INSERT INTO Applications (CandidateID, JobID, ResumeLink, CoverLetter)
        VALUES (@candidateId, @jobId, @resumeLink, @coverLetter)
      `);

    res.json({
      success: true,
      message: `Application submitted on ${applyDate}`,
      jobDeadline: job.Deadline ? job.Deadline.toISOString().split("T")[0] : null
    });

  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});


module.exports = router;
