# 🔧 Login/Signup Fix Guide

This guide will help you fix the "Invalid Credentials" error when trying to register or login.

## 🎯 Step 1: Check Backend Connection (Critical!)

### Verify Backend is Running

1. Open terminal and go to project root:
   ```bash
   cd "d:\SEMESTER-Projects\job\job"
   ```

2. Check if backend is running on port 5000:
   ```bash
   curl http://localhost:5000
   ```
   
   You should see:
   ```json
   {"ok":true,"message":"Job Portal Backend"}
   ```

   **If you get an error**: Start the backend first!
   ```bash
   npm run dev:backend
   ```
   Wait until you see: `Server listening on port 5000`

---

## 🎯 Step 2: Test Database Connection

### Check if Database is Connected

1. Open another terminal tab and navigate to backend:
   ```bash
   cd "d:\SEMESTER-Projects\job\job"
   ```

2. Check database status by visiting this debug endpoint in your browser:
   ```
   http://localhost:5000/api/debug/headers
   ```

3. You should see the request headers returned. If you get an error, the database might not be connected.

4. **To see detailed database connection info**, check the terminal where backend is running. Look for:
   ```
   Connected to SQL Server
   ```
   or
   ```
   Database Connection Failed! Bad Config:
   ```

---

## 🎯 Step 3: Verify .env Configuration

### Check Backend .env File

1. Make sure `.env` file exists in root directory: `d:\SEMESTER-Projects\job\job\.env`

2. It should contain:
   ```env
   JWT_SECRET=your_secure_jwt_secret_here
   NODE_ENV=development
   
   DB_SERVER=DESKTOP-KFTTOVK
   DB_INSTANCE=SQLEXPRESS
   DB_USER=job_portal
   DB_PASSWORD=12345678
   DB_NAME=JobPortalDB_F
   DB_PORT=1433
   ```

3. **If .env doesn't exist**, create it with the above content

4. If your SQL Server setup is different, adjust accordingly

---

## 🎯 Step 4: Test Registration with Console Logs

### Register a New Account and Check Console

1. **Start backend server** and WATCH THE TERMINAL for logs:
   ```bash
   npm run dev:backend
   ```

2. Open frontend: `http://localhost:3000`

3. Click "Sign Up" → Choose "Job Seeker"

4. Fill in the form:
   ```
   Email: testuser@example.com
   Password: Test12345
   Full Name: Test User
   Phone: +1234567890
   Skills: React, Node.js
   ```

5. Click "Create Account"

6. **LOOK AT BACKEND CONSOLE** - you should see:
   ```
   [REGISTER] Attempt - Role: candidate, Email: testuser@example.com
   [REGISTER] Processing candidate registration
   [REGISTER] Password hashed successfully
   [REGISTER] Candidate registered successfully: testuser@example.com
   ```

   **If you see errors instead**, note them down and check Step 5.

---

## 🎯 Step 5: Troubleshooting Common Errors

### Error: "Cannot read property 'poolPromise'"
```
Error: Cannot read property 'poolPromise' of undefined
```
**Solution**: 
- Check database connection
- Make sure SQL Server is running
- Verify .env file has correct credentials
- Check SQL Server is listening on port 1433

### Error: "Invalid object name 'Candidates'"
```
Error: Invalid object name 'Candidates'
```
**Solution**:
- Database tables don't exist
- Need to run database setup script (see below)

### Error: "Login failed for user 'job_portal'"
```
Error: Login failed for user 'job_portal'
```
**Solution**:
- SQL Server user doesn't exist or wrong password
- Create user: `job_portal` with password: `12345678`
- Or update `.env` with correct credentials

---

## 🎯 Step 6: Ensure Database Tables Exist

### Create Database Tables (If Not Exist)

1. Open SQL Server Management Studio (SSMS)

2. Connect to your SQL Server:
   - Server: `DESKTOP-KFTTOVK`
   - User: `job_portal`
   - Password: `12345678`

3. Create database:
   ```sql
   CREATE DATABASE JobPortalDB_F;
   ```

4. Run this script to create tables:

   ```sql
   USE JobPortalDB_F;

   -- Create Candidates Table
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
   CREATE TABLE Admins (
       AdminID INT PRIMARY KEY IDENTITY(1,1),
       Username NVARCHAR(255) UNIQUE NOT NULL,
       PasswordHash NVARCHAR(MAX) NOT NULL,
       CreatedAt DATETIME DEFAULT GETDATE()
   );

   -- Create Jobs Table
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
   CREATE TABLE Interviews (
       InterviewID INT PRIMARY KEY IDENTITY(1,1),
       ApplicationID INT NOT NULL,
       ScheduledDate DATETIME,
       Location NVARCHAR(255),
       Mode NVARCHAR(50),
       Status NVARCHAR(50) DEFAULT 'Scheduled',
       FOREIGN KEY (ApplicationID) REFERENCES Applications(ApplicationID)
   );
   ```

5. Verify tables were created:
   ```sql
   SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo';
   ```

---

## 🎯 Step 7: Test Complete Flow

### Now Try Registration Again

1. **Restart backend** (to reset connection):
   ```bash
   npm run dev:backend
   ```

2. Open frontend: `http://localhost:3000`

3. Register new account with test credentials

4. **Check backend console** - should show successful registration logs

5. Click "Sign In" on login page

6. Use same credentials you just registered with

7. Should redirect to dashboard if login successful

---

## 🎯 Step 8: View Detailed Error Messages

### Enable Verbose Logging

The backend now logs detailed information. Check the backend terminal when:

- You try to register → Look for `[REGISTER]` logs
- You try to login → Look for `[LOGIN]` logs

### Common Log Messages:

**Successful Registration**:
```
[REGISTER] Attempt - Role: candidate, Email: test@example.com
[REGISTER] Processing candidate registration
[REGISTER] Password hashed successfully
[REGISTER] Candidate registered successfully: test@example.com
```

**Successful Login**:
```
[LOGIN] Attempt - Role: candidate, Email: test@example.com
[LOGIN] Querying Candidates for Email=test@example.com
[LOGIN] User found: YES
[LOGIN] Comparing passwords for user 1
[LOGIN] Password matched. Generating token for user 1
[LOGIN] Token generated successfully
```

**Failed Login - User Not Found**:
```
[LOGIN] Attempt - Role: candidate, Email: test@example.com
[LOGIN] No user found with Email=test@example.com
```

**Failed Login - Wrong Password**:
```
[LOGIN] Attempt - Role: candidate, Email: test@example.com
[LOGIN] User found: YES
[LOGIN] Comparing passwords for user 1
[LOGIN] Password mismatch
```

---

## 🎯 Quick Checklist

- [ ] Backend running on port 5000
- [ ] SQL Server running
- [ ] Database `JobPortalDB_F` exists
- [ ] Database tables created (or run SQL script above)
- [ ] `.env` file configured correctly
- [ ] Credentials are correct in `.env`
- [ ] Frontend can access backend API
- [ ] Registered account shows in backend logs
- [ ] Can login with registered credentials

---

## 🔍 Still Having Issues?

### Copy the EXACT error message from:

1. **Backend console** (where you ran `npm run dev:backend`)
2. **Browser console** (F12 → Console tab)

### Then check:
1. Database connection errors
2. Table creation errors
3. Password hashing issues
4. JWT token generation issues

---

## 📝 Notes

- After registration, you MUST login before accessing dashboards
- Backend now logs everything - check terminal for detailed info
- If you modify `.env`, you need to restart backend
- Password must be at least 6 characters
- Email must be unique per role

---

**Once you complete these steps, authentication should work perfectly!** ✅
