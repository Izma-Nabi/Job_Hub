const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { poolPromise } = require('../db');
const sql = require('mssql');

// GET /api/candidate/me - Get the current candidate's profile
router.get('/me', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Forbidden: Only candidates can access this route.' });
    }
    const pool = await poolPromise;
    const result = await pool.request()
      .input('candidateID', sql.Int, req.user.id)
      .query('SELECT CandidateID, FullName, Email, PhoneNumber, Skills FROM Candidates WHERE CandidateID = @candidateID');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching candidate profile:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// PUT /api/candidate/me - Update the current candidate's profile
router.put('/me', authenticate, async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Forbidden: Only candidates can access this route.' });
  }
  const { fullName, phoneNumber, skills } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('candidateID', sql.Int, req.user.id)
      .input('fullName', sql.VarChar, fullName)
      .input('phoneNumber', sql.VarChar, phoneNumber)
      .input('skills', sql.VarChar, skills)
      .query(`
        UPDATE Candidates 
        SET FullName = @fullName, PhoneNumber = @phoneNumber, Skills = @skills 
        WHERE CandidateID = @candidateID
      `);

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating candidate profile:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;