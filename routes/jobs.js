const express = require('express');
const { sql, poolPromise } = require('../db');
const { authenticate, requireRole, isCompanyVerified } = require('../middleware/auth'); // Corrected import

const router = express.Router();

// Helper: check owner or admin
async function checkJobOwnerOrAdmin(jobId, req) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, jobId)
    .query('SELECT CompanyID FROM Jobs WHERE JobID = @id');

  const job = result.recordset[0];
  if (!job) return { ok: false, status: 404, error: 'Job not found' };
  if (req.user.role === 'admin') return { ok: true };
  if (req.user.role === 'company' && Number(req.user.id) === Number(job.CompanyID)) return { ok: true };
  return { ok: false, status: 403, error: 'Forbidden' };
}

// =========================
// GET All Active Jobs (for candidates)
// =========================
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          j.JobID, j.Title, j.Location, j.SalaryRange, j.EmploymentType,
          c.CompanyName
        FROM Jobs j
        JOIN Companies c ON j.CompanyID = c.CompanyID
        WHERE j.IsActive = 1
        ORDER BY j.PostedAt DESC
      `);
    res.json({ success: true, jobs: result.recordset });
  } catch (err) {
    console.error('Error fetching all jobs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// GET Jobs by Company
// =========================
router.get('/company/:companyId', async (req, res) => {
  try {
    const companyId = Number(req.params.companyId);
    if (!companyId) return res.status(400).json({ error: 'Invalid companyId' });

    const pool = await poolPromise;
    const result = await pool.request()
      .input('companyId', sql.Int, companyId)
      .query(`
        SELECT JobID, CompanyID, Title, Description, Requirements, Location, SalaryRange, EmploymentType, Deadline, PostedAt, IsActive
        FROM Jobs
        WHERE CompanyID = @companyId
      `);

    res.json({ success: true, jobs: result.recordset });
  } catch (err) {
    console.error('Error fetching jobs for company:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// GET Job by ID
// =========================
router.get('/:id', async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    if (!jobId) return res.status(400).json({ error: 'Invalid job id' });

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, jobId)
      .query(`
        SELECT JobID as id, CompanyID, Title, Description, Requirements, Location, SalaryRange, EmploymentType, Deadline, PostedAt, IsActive
        FROM Jobs
        WHERE JobID = @id
      `);

    const job = result.recordset[0];
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// POST /api/jobs - create a job (company only)
// =========================
router.post('/', authenticate, requireRole('company'), isCompanyVerified, async (req, res) => {
  try {
    const companyId = Number(req.user.id);
    const { title, description, requirements, location, salaryRange, employmentType, deadline, isActive } = req.body;

    if (!title || !description) return res.status(400).json({ error: 'title and description required' });

    const pool = await poolPromise;
    const insert = await pool.request()
      .input('companyId', sql.Int, companyId)
      .input('title', sql.VarChar(200), title)
      .input('description', sql.VarChar(2000), description)
      .input('requirements', sql.VarChar(2000), requirements || null)
      .input('location', sql.VarChar(200), location || null)
      .input('salaryRange', sql.VarChar(100), salaryRange || null)
      .input('employmentType', sql.VarChar(50), employmentType || null)
      .input('deadline', sql.Date, deadline || null)
      .input('isActive', sql.Bit, typeof isActive === 'number' ? (isActive ? 1 : 0) : (isActive === undefined ? 1 : (isActive ? 1 : 0)))
      .query(`
        INSERT INTO Jobs (CompanyID, Title, Description, Requirements, Location, SalaryRange, EmploymentType, Deadline, IsActive)
        OUTPUT INSERTED.JobID AS id
        VALUES (@companyId, @title, @description, @requirements, @location, @salaryRange, @employmentType, @deadline, @isActive)
      `);

    const newId = insert.recordset[0].id;
    res.json({ success: true, id: newId });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// PUT /api/jobs/:id - update a job
// =========================
router.put('/:id', authenticate, async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    if (!jobId) return res.status(400).json({ error: 'Invalid job id' });

    const check = await checkJobOwnerOrAdmin(jobId, req);
    if (!check.ok) return res.status(check.status).json({ error: check.error });

    const { title, description, requirements, location, salaryRange, employmentType, deadline, isActive } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, jobId)
      .input('title', sql.VarChar(200), title || null)
      .input('description', sql.VarChar(2000), description || null)
      .input('requirements', sql.VarChar(2000), requirements || null)
      .input('location', sql.VarChar(200), location || null)
      .input('salaryRange', sql.VarChar(100), salaryRange || null)
      .input('employmentType', sql.VarChar(50), employmentType || null)
      .input('deadline', sql.Date, deadline || null)
      .input('isActive', sql.Bit, typeof isActive === 'number' ? (isActive ? 1 : 0) : (isActive === undefined ? null : (isActive ? 1 : 0)))
      .query(`
        UPDATE Jobs SET
          Title = COALESCE(@title, Title),
          Description = COALESCE(@description, Description),
          Requirements = COALESCE(@requirements, Requirements),
          Location = COALESCE(@location, Location),
          SalaryRange = COALESCE(@salaryRange, SalaryRange),
          EmploymentType = COALESCE(@employmentType, EmploymentType),
          Deadline = COALESCE(@deadline, Deadline),
          IsActive = COALESCE(@isActive, IsActive)
        WHERE JobID = @id
      `);

    const updated = await pool.request().input('id', sql.Int, jobId)
      .query(`
        SELECT JobID as id, CompanyID, Title, Description, Requirements, Location, SalaryRange, EmploymentType, Deadline, PostedAt, IsActive
        FROM Jobs
        WHERE JobID = @id
      `);

    res.json({ success: true, job: updated.recordset[0] });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// DELETE /api/jobs/:id - delete a job
// =========================
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    if (!jobId) return res.status(400).json({ error: 'Invalid job id' });

    const check = await checkJobOwnerOrAdmin(jobId, req);
    if (!check.ok) return res.status(check.status).json({ error: check.error });

    const pool = await poolPromise;
    await pool.request().input('id', sql.Int, jobId)
      .query('DELETE FROM Jobs WHERE JobID = @id');

    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// POST /api/jobs/:id/apply - candidate applies to a job
// =========================
router.post('/:id/apply', authenticate, requireRole('candidate'), async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const candidateId = req.user.id;
    const { coverLetter, resumeLink } = req.body;

    const pool = await poolPromise;

    // Check if candidate already applied
    const check = await pool.request()
      .input('candidateId', sql.Int, candidateId)
      .input('jobId', sql.Int, jobId)
      .query(`
        SELECT ApplicationID
        FROM Applications
        WHERE CandidateID = @candidateId AND JobID = @jobId
      `);

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: "You already applied to this job." });
    }

    // Insert application
    const insert = await pool.request()
      .input('candidateId', sql.Int, candidateId)
      .input('jobId', sql.Int, jobId)
      .input('coverLetter', sql.VarChar(2000), coverLetter || null)
      .input('resumeLink', sql.VarChar(300), resumeLink)
      .query(`
        INSERT INTO Applications (CandidateID, JobID, CoverLetter, ResumeLink, Status, AppliedAt)
        OUTPUT INSERTED.ApplicationID AS id
        VALUES (@candidateId, @jobId, @coverLetter, @resumeLink, 'Pending', GETDATE())
      `);

    res.status(201).json({
      message: "Application submitted successfully!",
      applicationId: insert.recordset[0].id
    });

  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// GET /api/jobs/:jobId/applications - get all applications for a job (company only)
// =========================
router.get('/:jobId/applications', authenticate, requireRole('company'), async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const companyId = Number(req.user.id);

    if (!jobId) return res.status(400).json({ error: 'Invalid job id' });

    // First, verify the company asking for applications actually owns the job
    const check = await checkJobOwnerOrAdmin(jobId, req);
    if (!check.ok) return res.status(check.status).json({ error: check.error });

    const pool = await poolPromise;
    const result = await pool.request()
      .input('jobId', sql.Int, jobId)
      .query(`
        SELECT 
          a.ApplicationID, a.Status, a.AppliedAt, a.CoverLetter, a.ResumeLink,
          c.CandidateID, c.FullName, c.Email, c.PhoneNumber, c.Skills, c.ExperienceYears
        FROM Applications a
        JOIN Candidates c ON a.CandidateID = c.CandidateID
        WHERE a.JobID = @jobId
        ORDER BY a.AppliedAt DESC
      `);

    res.json({ success: true, applications: result.recordset });

  } catch (err) {
    console.error('Error fetching applications for job:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// GET /api/jobs/:jobId/interviews - get all interviews for a job (company only)
// =========================
router.get('/:jobId/interviews', authenticate, requireRole('company'), async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    if (!jobId) return res.status(400).json({ error: 'Invalid job id' });

    const check = await checkJobOwnerOrAdmin(jobId, req);
    if (!check.ok) return res.status(check.status).json({ error: check.error });

    const pool = await poolPromise;
    const result = await pool.request()
        .input('jobId', sql.Int, jobId)
        .query(`SELECT
            i.InterviewID, i.ScheduledDate, i.Location, i.Mode, i.Status,
            cand.CandidateID, cand.FullName, cand.Email, cand.PhoneNumber,
            app.ApplicationID
         FROM Interviews i
         JOIN Applications app ON i.ApplicationID = app.ApplicationID
         JOIN Candidates cand ON app.CandidateID = cand.CandidateID
         WHERE app.JobID = @jobId`);

    res.json({ success: true, interviews: result.recordset });
  } catch (err) {
    console.error('Error fetching interviews for job:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// DELETE /api/jobs/:id/application - delete candidate's application
// =========================
router.delete('/:id/application', authenticate, requireRole('candidate'), async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const candidateId = req.user.id;

    const pool = await poolPromise; // <--- required to access DB

    // Check if application exists
    const app = await pool.request()
      .input('candidateId', sql.Int, candidateId)
      .input('jobId', sql.Int, jobId)
      .query(`
        SELECT ApplicationID
        FROM Applications
        WHERE CandidateID = @candidateId AND JobID = @jobId
      `);

    if (app.recordset.length === 0) {
      return res.status(404).json({ message: "No application found for this job." });
    }

    const applicationId = app.recordset[0].ApplicationID;

    // Delete application
    await pool.request()
      .input('applicationId', sql.Int, applicationId)
      .query(`DELETE FROM Applications WHERE ApplicationID = @applicationId`);

    res.json({
      message: "Application deleted successfully.",
      applicationId
    });

  } catch (err) {
    console.error("Delete Application Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
