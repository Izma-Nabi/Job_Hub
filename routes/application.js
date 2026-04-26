const express = require('express');
const router = express.Router();
const db = require('./db'); // Assuming you have a db connection module
const { authenticate: auth, requireRole } = require('./middleware/auth'); // Assuming auth middleware

/**
 * @route   POST /api/applications/:applicationId/interview
 * @desc    Company schedules an interview for an application
 * @access  Private (Company)
 */
router.post('/:applicationId/interview', auth, requireRole('company'), async (req, res) => {
  const { scheduledDate, location, mode } = req.body;
  const { applicationId } = req.params;
  const companyId = req.user.id; // from auth middleware

  if (!scheduledDate || !mode) {
    return res.status(400).json({ error: 'scheduledDate and mode are required' });
  }

  try {
    // Verify the company owns the job associated with the application
    const [rows] = await db.query(
      `SELECT j.CompanyID FROM Applications a JOIN Jobs j ON a.JobID = j.JobID WHERE a.ApplicationID = ? AND j.CompanyID = ?`,
      [applicationId, companyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application not found or you do not have permission to update it.' });
    }

    // Use a transaction to ensure both operations succeed or fail together
    await db.beginTransaction();

    // 1. Create the interview
    await db.query(
      'INSERT INTO Interviews (ApplicationID, ScheduledDate, Location, Mode) VALUES (?, ?, ?, ?)',
      [applicationId, scheduledDate, location, mode]
    );

    // 2. Update the application status to 'Reviewed'
    await db.query(
      `UPDATE Applications SET Status = 'Reviewed' WHERE ApplicationID = ?`,
      [applicationId]
    );

    await db.commit();

    res.json({ success: true, message: 'Interview scheduled successfully.' });
  } catch (err) {
    await db.rollback();
    console.error(err.message);
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'An interview has already been scheduled for this application.' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/applications/:applicationId/status
 * @desc    Company updates an application status (e.g., to Accepted, Rejected)
 * @access  Private (Company)
 */
router.put('/:applicationId/status', auth, requireRole('company'), async (req, res) => {
  const { status } = req.body;
  const { applicationId } = req.params;
  const companyId = req.user.id; // from auth middleware

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['Accepted', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    // Verify the company owns the job associated with the application
    const [rows] = await db.query(
      `SELECT j.CompanyID FROM Applications a JOIN Jobs j ON a.JobID = j.JobID WHERE a.ApplicationID = ? AND j.CompanyID = ?`,
      [applicationId, companyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application not found or you do not have permission to update it.' });
    }

    // Update the status
    await db.query(
      'UPDATE Applications SET Status = ? WHERE ApplicationID = ?',
      [status, applicationId]
    );

    res.json({ success: true, message: `Application status updated to ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/applications/me
 * @desc    Candidate gets all their applications to see status
 * @access  Private (Candidate)
 */
router.get('/me', auth, requireRole('candidate'), async (req, res) => {
  const candidateId = req.user.id; // from auth middleware

  try {
    const [applications] = await db.query(
      `SELECT a.ApplicationID, a.Status, a.AppliedAt, j.Title, c.CompanyName,
              i.ScheduledDate, i.Location AS InterviewLocation, i.Mode AS InterviewMode, i.Status AS InterviewStatus
       FROM Applications a
       JOIN Jobs j ON a.JobID = j.JobID
       JOIN Companies c ON j.CompanyID = c.CompanyID
       LEFT JOIN Interviews i ON a.ApplicationID = i.ApplicationID
       WHERE a.CandidateID = ?
       ORDER BY a.AppliedAt DESC`,
      [candidateId]
    );
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/jobs/:jobId/interviews
 * @desc    Company views all candidates selected for interviews for a specific job
 * @access  Private (Company)
 */
router.get('/jobs/:jobId/interviews', auth, requireRole('company'), async (req, res) => {
    const { jobId } = req.params;
    const companyId = req.user.id; // from auth middleware
 
    try {
        const [interviews] = await db.query(
            `SELECT
                i.InterviewID, i.ScheduledDate, i.Location, i.Mode, i.Status,
                cand.CandidateID, cand.FullName, cand.Email, cand.PhoneNumber,
                app.ApplicationID
             FROM Interviews i
             JOIN Applications app ON i.ApplicationID = app.ApplicationID
             JOIN Candidates cand ON app.CandidateID = cand.CandidateID
             JOIN Jobs j ON app.JobID = j.JobID
             WHERE app.JobID = ? AND j.CompanyID = ?`,
            [jobId, companyId]
        );
        res.json(interviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
 
/**
 * @route   PUT /api/interviews/:interviewId/status
 * @desc    Company updates an interview status and notifies candidate
 * @access  Private (Company)
 */
router.put('/interviews/:interviewId/status', auth, requireRole('company'), async (req, res) => {
    const { status } = req.body;
    const { interviewId } = req.params;
    const companyId = req.user.id;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['Completed', 'Hired', 'Rejected', 'No-show'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        // Verify the company owns the job associated with the interview
        const [rows] = await db.query(
            `SELECT i.InterviewID, a.CandidateID, j.Title as JobTitle
             FROM Interviews i
             JOIN Applications a ON i.ApplicationID = a.ApplicationID
             JOIN Jobs j ON a.JobID = j.JobID
             WHERE i.InterviewID = ? AND j.CompanyID = ?`,
            [interviewId, companyId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Interview not found or you do not have permission to update it.' });
        }

        const { CandidateID, JobTitle } = rows[0];

        await db.beginTransaction();

        // 1. Update the interview status
        await db.query('UPDATE Interviews SET Status = ? WHERE InterviewID = ?', [status, interviewId]);

        // 2. If Hired or Rejected, create a notification for the candidate
        if (status === 'Hired' || status === 'Rejected') {
            const message = status === 'Hired'
                ? `Congratulations! Your interview for the ${JobTitle} position has been updated. You have been hired!`
                : `Update on your application for ${JobTitle}: Following your interview, the company has decided not to move forward at this time.`;

            await db.query(
                'INSERT INTO Notifications (UserID, UserType, Message, Link) VALUES (?, ?, ?, ?)',
                [CandidateID, 'candidate', message, '/applications/me']
            );
        }

        await db.commit();

        res.json({ success: true, message: `Interview status updated to ${status} and candidate notified.` });
    } catch (err) {
        await db.rollback();
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/notifications
 * @desc    Get notifications for the logged-in user
 * @access  Private
 */
router.get('/notifications', auth, async (req, res) => {
    try {
        const [notifications] = await db.query(
            'SELECT * FROM Notifications WHERE UserID = ? AND UserType = ? ORDER BY CreatedAt DESC',
            [req.user.id, req.user.role]
        );
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;