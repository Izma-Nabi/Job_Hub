#!/usr/bin/env node
/**
 * Database Setup & Verification Script
 * Usage: node verify-db.js
 */

const sql = require('mssql');

// Configuration
const config = {
  user: 'job_portal',
  password: '12345678',
  server: 'DESKTOP-KFTTOVK',
  database: 'JobPortalDB_F',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: 'SQLEXPRESS'
  },
  connectionTimeout: 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function main() {
  console.log('🔍 Database Verification Script');
  console.log('================================\n');

  try {
    // Step 1: Connect
    console.log('📡 Step 1: Connecting to SQL Server...');
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Connected to SQL Server\n');

    // Step 2: Check database
    console.log('📡 Step 2: Checking database existence...');
    const dbResult = await pool.request()
      .query(`SELECT name FROM sys.databases WHERE name = '${config.database}'`);
    
    if (dbResult.recordset.length === 0) {
      console.log(`❌ Database '${config.database}' does not exist`);
      console.log('   Creating database...');
      await pool.request()
        .query(`CREATE DATABASE ${config.database}`);
      console.log(`✅ Database '${config.database}' created\n`);
    } else {
      console.log(`✅ Database '${config.database}' exists\n`);
    }

    // Step 3: Check tables
    console.log('📡 Step 3: Checking tables...');
    const tables = ['Candidates', 'Companies', 'Admins', 'Jobs', 'Applications', 'Interviews'];
    let allTablesExist = true;

    for (const table of tables) {
      const result = await pool.request()
        .query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = '${table}'`);
      
      if (result.recordset.length === 0) {
        console.log(`❌ Table '${table}' does not exist`);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    }
    console.log('');

    // Step 4: Create tables if they don't exist
    if (!allTablesExist) {
      console.log('📡 Step 4: Creating missing tables...');
      await createTables(pool);
      console.log('✅ Tables created successfully\n');
    } else {
      console.log('✅ Step 4: All tables exist\n');
    }

    // Step 5: Test password hashing
    console.log('📡 Step 5: Testing password hashing...');
    const bcrypt = require('bcryptjs');
    const testPassword = 'TestPassword123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    
    if (isMatch) {
      console.log('✅ Password hashing works correctly\n');
    } else {
      console.log('❌ Password hashing failed\n');
    }

    // Step 6: Test with sample registration
    console.log('📡 Step 6: Testing with sample registration...');
    const testEmail = 'test_' + Date.now() + '@example.com';
    const testPassword2 = 'Test12345';
    const hashedPass = await bcrypt.hash(testPassword2, 10);

    try {
      const insertResult = await pool.request()
        .input('fullName', sql.VarChar, 'Test User')
        .input('email', sql.VarChar, testEmail)
        .input('passwordHash', sql.VarChar, hashedPass)
        .input('phoneNumber', sql.VarChar, '1234567890')
        .input('skills', sql.VarChar, 'Node.js,React')
        .query('INSERT INTO Candidates (FullName, Email, PasswordHash, PhoneNumber, Skills) VALUES (@fullName, @email, @passwordHash, @phoneNumber, @skills)');
      
      console.log('✅ Sample candidate inserted successfully');
      console.log(`   Email: ${testEmail}`);
      console.log(`   Password: ${testPassword2}\n`);
    } catch (err) {
      console.log('❌ Failed to insert sample candidate:', err.message, '\n');
    }

    // Step 7: Test login flow
    console.log('📡 Step 7: Testing login flow...');
    const loginResult = await pool.request()
      .input('email', sql.VarChar, testEmail)
      .query('SELECT * FROM Candidates WHERE Email = @email');
    
    if (loginResult.recordset.length > 0) {
      const user = loginResult.recordset[0];
      const passwordMatch = await bcrypt.compare(testPassword2, user.PasswordHash);
      
      if (passwordMatch) {
        console.log('✅ Login flow works correctly');
        console.log(`   User found: ${user.FullName} (${user.Email})`);
        console.log(`   Password verified: YES\n`);
      } else {
        console.log('❌ Password verification failed\n');
      }
    } else {
      console.log('❌ User not found\n');
    }

    // Step 8: Summary
    console.log('================================');
    console.log('✅ Database verification complete!');
    console.log('================================\n');

    console.log('Your database is now ready. Try:');
    console.log('1. npm run dev:backend');
    console.log('2. npm run dev:frontend');
    console.log('3. Register at http://localhost:3000/signup');
    console.log('4. Login at http://localhost:3000/login');

    await pool.close();
    process.exit(0);

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure SQL Server is running');
    console.error('2. Verify connection string in .env');
    console.error('3. Check if user "job_portal" exists');
    console.error('4. Verify database "JobPortalDB_F" exists');
    process.exit(1);
  }
}

async function createTables(pool) {
  const createTablesSQL = `
    USE ${config.database};

    -- Create Candidates Table
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Candidates')
    CREATE TABLE Candidates (
        CandidateID INT PRIMARY KEY IDENTITY(1,1),
        FullName NVARCHAR(255),
        Email NVARCHAR(255) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        PhoneNumber NVARCHAR(20),
        Skills NVARCHAR(MAX),
        ExperienceYears INT,
        CreatedAt DATETIME DEFAULT GETDATE()
    );

    -- Create Companies Table
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Companies')
    CREATE TABLE Companies (
        CompanyID INT PRIMARY KEY IDENTITY(1,1),
        CompanyName NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Industry NVARCHAR(255),
        Location NVARCHAR(255),
        Website NVARCHAR(255),
        Description NVARCHAR(MAX),
        IsVerified BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE()
    );

    -- Create Admins Table
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Admins')
    CREATE TABLE Admins (
        AdminID INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(255) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );

    -- Create Jobs Table
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Jobs')
    CREATE TABLE Jobs (
        JobID INT PRIMARY KEY IDENTITY(1,1),
        CompanyID INT NOT NULL,
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX),
        Requirements NVARCHAR(MAX),
        Location NVARCHAR(255),
        SalaryRange NVARCHAR(100),
        EmploymentType NVARCHAR(50),
        Deadline DATETIME,
        PostedAt DATETIME DEFAULT GETDATE(),
        IsActive BIT DEFAULT 1,
        FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID)
    );

    -- Create Applications Table
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Applications')
    CREATE TABLE Applications (
        ApplicationID INT PRIMARY KEY IDENTITY(1,1),
        CandidateID INT NOT NULL,
        JobID INT NOT NULL,
        CoverLetter NVARCHAR(MAX),
        ResumeLink NVARCHAR(MAX),
        Status NVARCHAR(50) DEFAULT 'Pending',
        AppliedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (CandidateID) REFERENCES Candidates(CandidateID),
        FOREIGN KEY (JobID) REFERENCES Jobs(JobID)
    );

    -- Create Interviews Table
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Interviews')
    CREATE TABLE Interviews (
        InterviewID INT PRIMARY KEY IDENTITY(1,1),
        ApplicationID INT NOT NULL,
        ScheduledDate DATETIME,
        Location NVARCHAR(255),
        Mode NVARCHAR(50),
        Status NVARCHAR(50) DEFAULT 'Scheduled',
        FOREIGN KEY (ApplicationID) REFERENCES Applications(ApplicationID)
    );
  `;

  // Split by GO and execute each batch
  const batches = createTablesSQL.split('GO');
  for (const batch of batches) {
    if (batch.trim()) {
      await pool.request().query(batch);
    }
  }
}

// Run the script
main();
