const express = require('express');
const router = express.Router();
const { authenticate } = require('./middleware/auth');
const { poolPromise } = require('./db');
const sql = require('mssql');

// GET /api/applications - Get all applications for the logged-in candidate
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ error: 'Only candidates can view their applications' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('candidateID', sql.Int, req.user.id)
      .query(`
        SELECT 
          app.ApplicationID,
          app.CandidateID,
          app.JobID,
          app.CoverLetter,
          app.ResumeLink,
          app.Status,
          app.AppliedAt,
          ISNULL(j.Title, 'Job Listing') as JobTitle,
          ISNULL(j.Location, 'N/A') as Location,
          ISNULL(j.SalaryRange, 'N/A') as SalaryRange,
          ISNULL(c.CompanyName, 'Company') as CompanyName
        FROM Applications app
        LEFT JOIN Jobs j ON app.JobID = j.JobID
        LEFT JOIN Companies c ON j.CompanyID = c.CompanyID
        WHERE app.CandidateID = @candidateID
        ORDER BY app.AppliedAt DESC
      `);

    res.json({ success: true, applications: result.recordset });
  } catch (err) {
    console.error('Error fetching candidate applications:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// GET /api/applications/:applicationId - Get a specific application
router.get('/:applicationId', authenticate, async (req, res) => {
  try {
    const applicationId = Number(req.params.applicationId);
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('applicationID', sql.Int, applicationId)
      .query(`
        SELECT 
          app.ApplicationID,
          app.CandidateID,
          app.JobID,
          app.CoverLetter,
          app.ResumeLink,
          app.Status,
          app.AppliedAt,
          ISNULL(j.Title, 'Job Listing') as JobTitle,
          ISNULL(j.Location, 'N/A') as Location,
          ISNULL(j.SalaryRange, 'N/A') as SalaryRange,
          ISNULL(c.CompanyName, 'Company') as CompanyName
        FROM Applications app
        LEFT JOIN Jobs j ON app.JobID = j.JobID
        LEFT JOIN Companies c ON j.CompanyID = c.CompanyID
        WHERE app.ApplicationID = @applicationID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = result.recordset[0];

    // Verify candidate owns this application
    if (req.user.role === 'candidate' && application.CandidateID !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ success: true, application });
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;