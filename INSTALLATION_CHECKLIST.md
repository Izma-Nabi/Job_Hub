# 🚀 JobHub - Installation Checklist

Complete this checklist to get your job portal running locally.

## 📋 Pre-Installation Requirements

- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] SQL Server installed and running
- [ ] Database `JobPortalDB_F` created
- [ ] Git (optional)

## 🔧 Backend Setup (5 minutes)

1. **Navigate to project directory**
   ```bash
   cd "d:\SEMESTER-Projects\job\job"
   ```
   - [ ] Confirmed directory contains `server.js`

2. **Install dependencies**
   ```bash
   npm install
   ```
   - [ ] All packages installed (check `node_modules` folder)
   - [ ] No error messages

3. **Configure database**
   - [ ] Verify SQL Server is running
   - [ ] Check `.env` file exists with correct credentials:
     ```env
     DB_SERVER=DESKTOP-KFTTOVK
     DB_INSTANCE=SQLEXPRESS
     DB_USER=job_portal
     DB_PASSWORD=12345678
     DB_NAME=JobPortalDB_F
     ```
   - [ ] Credentials match your SQL Server setup

4. **Start backend**
   ```bash
   npm run dev:backend
   # or: npm start
   ```
   - [ ] Terminal shows "Server running on port 5000"
   - [ ] No error messages about database connection

## 🎨 Frontend Setup (5 minutes)

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```
   - [ ] Confirmed current directory is `frontend`

2. **Install dependencies**
   ```bash
   npm install
   ```
   - [ ] All packages installed
   - [ ] No error messages
   - [ ] Check includes: react, next, tailwindcss, framer-motion

3. **Verify environment configuration**
   - [ ] `.env.local` file exists
   - [ ] Contains: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
   - [ ] No other environment variables needed (uses defaults)

4. **Start frontend development server**
   ```bash
   npm run dev
   ```
   - [ ] Terminal shows "▲ Next.js X.X.X"
   - [ ] Shows "Local: http://localhost:3000"
   - [ ] No error messages

## 🌐 Verify Installation

1. **Open browser**
   - [ ] Navigate to `http://localhost:3000`
   - [ ] Homepage loads without errors
   - [ ] Navigation bar visible
   - [ ] "Explore Jobs" button clickable

2. **Test Backend Connection**
   - [ ] Click on "Explore Jobs" or "Jobs" in navbar
   - [ ] Jobs list loads successfully
   - [ ] No "Failed to connect to API" errors

3. **Test Authentication**
   - [ ] Click "Sign Up" button
   - [ ] Registration form appears
   - [ ] Can toggle between "Job Seeker" and "Company"

## ✅ Quick Test Flow

1. **Register Account**
   - [ ] Choose "Job Seeker" role
   - [ ] Fill in email and password
   - [ ] Click "Create Account"
   - [ ] Redirected to login page

2. **Login**
   - [ ] Enter registered email and password
   - [ ] Click "Sign In"
   - [ ] Redirected to candidate dashboard
   - [ ] Dashboard displays profile information

3. **Browse Jobs**
   - [ ] Click "Explore Jobs" or "Jobs" in navbar
   - [ ] Jobs list displays
   - [ ] Can search, filter by location and type
   - [ ] Click on a job to view details

4. **Apply for Job**
   - [ ] Click "Apply for This Job" on job details page
   - [ ] Fill in resume link
   - [ ] Add optional cover letter
   - [ ] Submit application
   - [ ] Success message appears

## 🎓 Test as Different Roles

### Test as Company
- [ ] Register with "Company" role
- [ ] Login to company dashboard
- [ ] Click "Post a Job"
- [ ] Fill in job details
- [ ] Submit to create job
- [ ] Job appears in job listing

### Test as Admin (if available)
- [ ] Login with admin role
- [ ] Access admin dashboard
- [ ] View analytics and stats

## 🛠️ Troubleshooting Checklist

### Backend Issues

**Error: Cannot connect to SQL Server**
- [ ] SQL Server is running (check Windows Services)
- [ ] Database `JobPortalDB_F` exists
- [ ] Credentials in `.env` are correct
- [ ] No firewall blocking port 1433

**Error: Port 5000 already in use**
- [ ] Kill process using port 5000
- [ ] Or change PORT in `.env`

**Error: Module not found**
- [ ] Delete `node_modules` folder
- [ ] Run `npm install` again
- [ ] Delete `package-lock.json` if issues persist

### Frontend Issues

**Error: Cannot reach API**
- [ ] Backend is running on port 5000
- [ ] Check `.env.local` API URL
- [ ] Clear browser cache: `Ctrl+Shift+Delete`
- [ ] Clear localStorage: Run in console `localStorage.clear()`

**Error: Page won't load**
- [ ] Clear `.next` build folder
- [ ] Run `npm run dev` again
- [ ] Check browser console for errors (F12)

**Error: Port 3000 already in use**
- [ ] Kill process using port 3000
- [ ] Or run: `npm run dev -- -p 3001`

## 📚 Next Steps After Installation

1. **Explore the application**
   - [ ] Test all pages and features
   - [ ] Check responsive design on mobile (F12 > Device toolbar)

2. **Customize (Optional)**
   - [ ] Edit logo/branding
   - [ ] Modify colors in `tailwind.config.js`
   - [ ] Update content in components

3. **Development**
   - [ ] Read `/frontend/README.md` for dev guide
   - [ ] Read `FRONTEND_SETUP.md` for detailed setup
   - [ ] Check code structure in comments

4. **Production (When Ready)**
   - [ ] Build frontend: `npm run build`
   - [ ] Test production build: `npm start`
   - [ ] Deploy to hosting service

## 💾 Important Files to Keep Safe

- [ ] `.env` - Contains database credentials (don't share)
- [ ] `.env.local` - Contains API configuration
- [ ] Database backup - Backup your SQL Server database
- [ ] Code repository - Push to GitHub or GitLab

## 📞 Common Commands

```bash
# Backend
npm run dev:backend      # Start development server
npm start                # Start production server

# Frontend
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality

# Both (from root)
npm run dev              # Run both backend and frontend
```

## 🎉 Success Criteria

You've successfully set up JobHub when:

- ✅ Backend running without errors
- ✅ Frontend running without errors
- ✅ Homepage loads in browser
- ✅ Can register new account
- ✅ Can login with created account
- ✅ Can see list of jobs
- ✅ Can apply for jobs
- ✅ Can access dashboard

## 📝 Notes

- Keep both terminal windows open while developing
- Don't close terminal windows or servers will stop
- Refresh browser after making backend changes
- Frontend hot-reloads automatically on changes

## 🆘 Still Having Issues?

1. Check error messages carefully
2. Read the full error stack trace
3. Restart both servers
4. Clear all caches (browser, npm, `.next`)
5. Reinstall dependencies
6. Check internet connection
7. Verify all prerequisites are installed

---

**Last Updated**: April 2026
**Status**: Installation Guide Complete ✅
