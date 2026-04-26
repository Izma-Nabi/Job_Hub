# Job Portal - Complete Setup Guide

This is a modern, full-stack job portal application built with Next.js frontend and Express.js backend.

## 📋 Project Structure

```
job/
├── [Backend Files]
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── frontend/                  # New! Modern Next.js frontend
    ├── app/
    ├── components/
    ├── lib/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── next.config.js
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **SQL Server** running with the JobPortalDB_F database
- **Port 5000** for backend (configurable)
- **Port 3000** for frontend (configurable)

### Step 1: Backend Setup

1. **Navigate to project root**:
   ```bash
   cd "d:\SEMESTER-Projects\job\job"
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create or update `.env` file in root:
   ```env
   JWT_SECRET=your_secure_jwt_secret_here
   NODE_ENV=development
   
   DB_SERVER=DESKTOP-KFTTOVK
   DB_INSTANCE=SQLEXPRESS
   DB_USER=job_portal
   DB_PASSWORD=12345678
   DB_NAME=JobPortalDB_F
   DB_PORT=1433
   
   PORT=5000
   ```

4. **Start backend server**:
   ```bash
   npm run dev:backend
   # or
   npm start
   ```

   Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Environment is pre-configured** in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start frontend development server**:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

### Step 3: Access the Application

Open your browser and navigate to:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

## 🎯 Running Both Concurrently

### Option 1: Two Terminal Windows (Recommended for development)

**Terminal 1 - Backend**:
```bash
cd "d:\SEMESTER-Projects\job\job"
npm run dev:backend
```

**Terminal 2 - Frontend**:
```bash
cd "d:\SEMESTER-Projects\job\job\frontend"
npm run dev
```

### Option 2: Single Command (if concurrently is installed)

From root directory:
```bash
npm run dev
```

This requires the `concurrently` package (already added to package.json).

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login and get JWT token
```

### Job Routes
```
GET    /jobs                   # Get all jobs
GET    /jobs/:id               # Get job details
POST   /jobs                   # Create job (auth required)
PUT    /jobs/:id               # Update job (auth required)
DELETE /jobs/:id               # Delete job (auth required)
```

### Job Application Routes
```
POST   /jobs/:id/apply         # Apply for job (auth required)
DELETE /jobs/:id/application   # Withdraw application (auth required)
GET    /jobs/:id/applications  # Get applications for job (auth required)
GET    /jobs/:id/interviews    # Get interviews for job (auth required)
```

### Candidate Routes
```
GET    /candidate/me           # Get candidate profile (auth required)
PUT    /candidate/me           # Update profile (auth required)
```

For complete API details, refer to the backend analysis in the EXPLORATION notes.

## 🎨 Frontend Features

### Pages
- **Home** (`/`) - Landing page with hero and featured jobs
- **Jobs** (`/jobs`) - Job listings with search and filters
- **Job Details** (`/jobs/:id`) - Full job details and apply form
- **Login** (`/login`) - Login for all roles
- **Register** (`/register`) - Registration for candidates and companies
- **Candidate Dashboard** (`/dashboard/candidate`) - Candidate profile and applications
- **Company Dashboard** (`/dashboard/company`) - Post and manage jobs
- **Admin Dashboard** (`/dashboard/admin`) - Platform administration

### Components
- **Navbar** - Responsive navigation with auth
- **HeroSection** - Animated landing page hero
- **JobCard** - Job listing card with animations
- **JobCardSkeleton** - Loading states
- **ApplyForm** - Job application form
- **AuthContext** - Global authentication state

### Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations with Framer Motion
- ✅ JWT authentication with persistent sessions
- ✅ Job search and filtering
- ✅ Application management
- ✅ Profile management
- ✅ Role-based dashboards
- ✅ Error handling and validation
- ✅ Loading states and skeletons
- ✅ Glassmorphism UI design
- ✅ Gradient backgrounds and modern styling

## 👥 User Roles & Flows

### Candidate
1. Register as candidate
2. Complete profile (skills, phone, etc.)
3. Browse and search jobs
4. Apply for jobs with resume link
5. Track applications in dashboard
6. Edit profile

### Company
1. Register as company
2. Complete company info
3. Post job listings
4. View applications for jobs
5. Interview management
6. Edit job postings

### Admin
1. Login as admin
2. View platform analytics
3. Manage users
4. Verify companies
5. Moderate job postings
6. System administration

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

1. **Login**: Credentials are sent to backend
2. **Token Received**: JWT token returned
3. **Storage**: Token stored in `localStorage`
4. **API Calls**: Token attached to all requests in `Authorization` header
5. **Validation**: Backend validates token and processes request
6. **Session Persistence**: Session restored on page reload

Token payload includes: `{ id, role }`

## 🎓 Test Credentials

Create accounts using the registration page. Some pre-populated test data:

**SQL Server Connection**:
- Server: `DESKTOP-KFTTOVK`
- Database: `JobPortalDB_F`
- User: `job_portal`

## 📝 Development Tips

### Frontend Development
- Edit components in `frontend/components/`
- Edit pages in `frontend/app/`
- Edit styles in `frontend/app/globals.css` or component files
- Use Tailwind utilities for styling
- Use Framer Motion for animations

### Backend Development
- Edit routes in `routes/`
- Edit middleware in `middleware/`
- Database logic in `db.js`
- Server config in `server.js`

### Hot Reload
- Frontend: Changes auto-reload on save
- Backend: Uses `nodemon` for auto-restart

## 🛠️ Troubleshooting

### Backend Connection Failed
```
Error: Failed to connect to database
```
- Ensure SQL Server is running
- Check `.env` database credentials
- Verify network connectivity

### Frontend Can't Reach Backend
```
Error: Cannot connect to API
```
- Ensure backend is running on port 5000
- Check `.env.local` API_URL
- Check CORS settings in `server.js`
- Clear browser cache and `localStorage`

### Port Already in Use
- Backend: `npm start -- --port 5001`
- Frontend: `npm run dev -- -p 3001`

### Module Not Found
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 📦 Deployment

### Production Build

**Backend**:
```bash
npm install --production
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

### Environment Variables for Production
Update `.env` and `.env.local` with production values:
- Change `NODE_ENV=production`
- Update database credentials
- Use strong JWT secret
- Update API URLs

## 📄 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 💡 Next Steps

After running the application:

1. **Test Registration**: Create a candidate account
2. **Explore Jobs**: Browse the job listing
3. **Test Application**: Apply for a job
4. **Test Company**: Register as company and post a job
5. **Review Dashboards**: Check each role's dashboard

## 🤝 Support

For issues:
1. Check error messages in browser console and terminal
2. Review backend logs
3. Check database connectivity
4. Verify `.env` configuration
5. Check network requests in browser DevTools

## 📄 License

MIT License - Feel free to use this project for learning and development.
