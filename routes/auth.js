const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Make sure bcryptjs is installed: npm install bcryptjs
const sql = require('mssql');
const { poolPromise } = require('../db'); // Import the database connection pool
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'; // Ensure JWT_SECRET is available
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { role, email, username, password, fullName, companyName, phoneNumber, skills, industry, location, website, description } = req.body;

    console.log(`[REGISTER] Attempt - Role: ${role}, Email: ${email}, Username: ${username}`);

    if (!role || !password || (!email && role !== 'admin') || (!username && role === 'admin')) {
        console.log('[REGISTER] Missing required fields');
        return res.status(400).json({ message: 'Missing required registration fields.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('[REGISTER] Password hashed successfully');
        
        const pool = await poolPromise;
        let query;

        if (role === 'candidate') {
            console.log('[REGISTER] Processing candidate registration');
            
            // Check if candidate with this email already exists
            const checkCandidate = await pool.request()
                .input('email', sql.VarChar, email)
                .query('SELECT CandidateID FROM Candidates WHERE Email = @email');
            
            if (checkCandidate.recordset.length > 0) {
                console.log('[REGISTER] Candidate already exists:', email);
                return res.status(409).json({ message: 'Candidate with this email already exists.' });
            }
            
            query = `INSERT INTO Candidates (FullName, Email, PasswordHash, PhoneNumber, Skills) VALUES (@fullName, @email, @passwordHash, @phoneNumber, @skills)`;
            await pool.request()
                .input('fullName', sql.VarChar, fullName || null)
                .input('email', sql.VarChar, email)
                .input('passwordHash', sql.VarChar, hashedPassword)
                .input('phoneNumber', sql.VarChar, phoneNumber || null)
                .input('skills', sql.VarChar, skills || null)
                .query(query);
            
            console.log('[REGISTER] Candidate registered successfully:', email);
            
        } else if (role === 'company') {
            console.log('[REGISTER] Processing company registration');
            
            // Check if company with this email already exists
            const checkCompany = await pool.request()
                .input('email', sql.VarChar, email)
                .query('SELECT CompanyID FROM Companies WHERE Email = @email');
            
            if (checkCompany.recordset.length > 0) {
                console.log('[REGISTER] Company already exists:', email);
                return res.status(409).json({ message: 'Company with this email already exists.' });
            }

            query = `INSERT INTO Companies (CompanyName, Email, PasswordHash, Industry, Location, Website, Description) VALUES (@companyName, @email, @passwordHash, @industry, @location, @website, @description)`;
            await pool.request()
                .input('companyName', sql.VarChar, companyName || null)
                .input('email', sql.VarChar, email)
                .input('passwordHash', sql.VarChar, hashedPassword)
                .input('industry', sql.VarChar, industry || null)
                .input('location', sql.VarChar, location || null)
                .input('website', sql.VarChar, website || null)
                .input('description', sql.VarChar, description || null)
                .query(query);
            
            console.log('[REGISTER] Company registered successfully:', email);
            
        } else if (role === 'admin') {
            console.log('[REGISTER] Processing admin registration');
            
            query = `INSERT INTO Admins (Username, PasswordHash) VALUES (@username, @passwordHash)`;
            await pool.request()
                .input('username', sql.VarChar, username)
                .input('passwordHash', sql.VarChar, hashedPassword)
                .query(query);
            
            console.log('[REGISTER] Admin registered successfully:', username);
            
        } else {
            console.log('[REGISTER] Invalid role:', role);
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        res.status(201).json({ message: `${role} registered successfully. Please log in.` });
        
    } catch (err) {
        console.error('[REGISTER] Database error:', err.message);
        console.error('[REGISTER] Full error:', err);
        res.status(500).json({ message: 'Server error during registration: ' + err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { role, email, username, password } = req.body;

    console.log(`[LOGIN] Attempt - Role: ${role}, Email: ${email}, Username: ${username}`);

    if (!role || !password || (!email && role !== 'admin') || (!username && role === 'admin')) {
        console.log('[LOGIN] Missing required fields');
        return res.status(400).json({ message: 'Missing required login fields.' });
    }

    try {
        const pool = await poolPromise;
        let user;
        let tableName;
        let identifierField;
        let identifierValue;
        let idField;

        if (role === 'candidate') {
            tableName = 'Candidates';
            identifierField = 'Email';
            identifierValue = email;
            idField = 'CandidateID';
        } else if (role === 'company') {
            tableName = 'Companies';
            identifierField = 'Email';
            identifierValue = email;
            idField = 'CompanyID';
        } else if (role === 'admin') {
            tableName = 'Admins';
            identifierField = 'Username';
            identifierValue = username;
            idField = 'AdminID';
        } else {
            console.log('[LOGIN] Invalid role:', role);
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        console.log(`[LOGIN] Querying ${tableName} for ${identifierField}=${identifierValue}`);

        const result = await pool.request()
            .input('identifier', sql.VarChar, identifierValue)
            .query(`SELECT * FROM ${tableName} WHERE ${identifierField} = @identifier`);

        user = result.recordset[0];
        console.log(`[LOGIN] User found:`, user ? 'YES' : 'NO');

        if (!user) {
            console.log(`[LOGIN] No user found with ${identifierField}=${identifierValue}`);
            return res.status(401).json({ message: 'Invalid credentials. User not found.' });
        }

        console.log(`[LOGIN] Comparing passwords for user ${user[idField]}`);
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        
        if (!isMatch) {
            console.log('[LOGIN] Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials. Wrong password.' });
        }

        console.log(`[LOGIN] Password matched. Generating token for user ${user[idField]}`);

        // Generate JWT Token
        const token = jwt.sign({ id: user[idField], role: role }, JWT_SECRET, { expiresIn: '1h' });

        console.log('[LOGIN] Token generated successfully');
        res.status(200).json({ message: 'Login successful', token, role });

    } catch (err) {
        console.error('[LOGIN] Database error:', err.message);
        console.error('[LOGIN] Full error:', err);
        res.status(500).json({ message: 'Server error during login: ' + err.message });
    }
});

module.exports = router;