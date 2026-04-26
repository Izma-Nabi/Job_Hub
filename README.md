# Job Portal Backend (Auth)

This is a minimal Node.js backend providing registration and login endpoints for the Job Portal schema you provided.

Files added:
- `server.js` — Express app entry
- `db.js` — MySQL connection pool (mysql2)
- `routes/auth.js` — Registration & login endpoints for company, candidate, admin
- `.env.example` — Example environment variables
- `package.json` — dependencies and scripts

Prerequisites:
- Node.js 18+ (or Node.js 16+ should work)
- A Microsoft SQL Server instance with the `JobPortalDB_F` database created (your provided SQL). Example for a named instance: `DESKTOP-KFTTOVK\\SQLEXPRESS01`.

Quick setup (PowerShell):

```powershell
cd d:\job
copy .env.example .env
# Edit .env to set DB_SERVER, DB_INSTANCE, DB_USER, DB_PASSWORD, DB_NAME and JWT_SECRET
npm install
npm run dev
```

Endpoints (JSON bodies):

- POST `/api/auth/register/company`
  - body: `{ companyName, email, password, phoneNumber?, industry?, location?, website?, description? }`
  - returns: `{ success:true, id, token }`

- POST `/api/auth/register/candidate`
  - body: `{ fullName, email, password, phoneNumber?, skills?, resumeLink?, coverLetter?, experienceYears? }`
  - returns: `{ success:true, id, token }`

- POST `/api/auth/login`
  - body: `{ email, password, role }` where `role` is `company`, `candidate`, or `admin`
  - returns: `{ success:true, id, token }`

Notes:
- Passwords are hashed with `bcryptjs` before storing.
- Tokens are signed with `JWT_SECRET` from `.env`.
- `db.js` is configured to connect to SQL Server using `DB_SERVER` and `DB_INSTANCE` environment variables.
- This code is minimal and intended as a starting point — add validation, rate-limiting, HTTPS, input sanitization and production hardening before deploying.
