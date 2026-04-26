# JobHub Frontend

A modern, responsive job portal frontend built with Next.js 14, React, Tailwind CSS, and Framer Motion.

## 🎨 Features

- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **Responsive Design**: Mobile-first approach, works perfectly on all devices
- **Smooth Animations**: Framer Motion animations for page transitions and hover effects
- **Multiple User Roles**: Support for candidates, companies, and admins
- **Authentication**: JWT-based authentication with persistent sessions
- **Job Management**: Browse, search, filter, and apply to jobs
- **Recruiter Tools**: Post jobs, manage applications (for companies)
- **Admin Dashboard**: Manage platform and users
- **Real-time Integration**: Connected to Express backend API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   The `.env.local` file is already configured to use the backend at `http://localhost:5000/api`

   If you need to change the backend URL, edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://your-backend-url/api
   ```

### Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

The application will auto-update as you make changes.

## 📦 Build & Deploy

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with auth provider
│   ├── globals.css             # Global styles and Tailwind
│   ├── page.tsx                # Home page with hero and featured jobs
│   ├── jobs/
│   │   ├── page.tsx            # Jobs listing page with filters
│   │   └── [id]/
│   │       └── page.tsx        # Job details and apply form
│   ├── login/
│   │   └── page.tsx            # Login page for all roles
│   ├── register/
│   │   └── page.tsx            # Registration page
│   └── dashboard/
│       ├── candidate/
│       │   └── page.tsx        # Candidate dashboard
│       ├── company/
│       │   └── page.tsx        # Company/recruiter dashboard
│       └── admin/
│           └── page.tsx        # Admin dashboard
├── components/
│   ├── Navbar.tsx              # Navigation bar with auth
│   ├── HeroSection.tsx         # Landing page hero
│   ├── JobCard.tsx             # Job listing card
│   ├── JobCardSkeleton.tsx     # Loading skeleton
│   └── ApplyForm.tsx           # Job application form
├── context/
│   └── AuthContext.tsx         # Global auth state management
├── lib/
│   └── api.ts                  # Axios API client with interceptors
├── public/                     # Static assets
└── package.json
```

## 🔑 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`. Key endpoints:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Jobs
- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get job details
- `POST /jobs/:id/apply` - Apply to a job
- `DELETE /jobs/:id/application` - Withdraw application

### Candidate
- `GET /candidate/me` - Get profile
- `PUT /candidate/me` - Update profile

### Company
- `POST /jobs` - Post a new job
- `PUT /jobs/:id` - Edit job
- `DELETE /jobs/:id` - Delete job
- `GET /jobs/:id/applications` - View applications

## 🎨 Customization

### Tailwind Colors
Edit `tailwind.config.js` to customize colors:
```js
colors: {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
}
```

### Fonts
Edit `app/layout.tsx` to change fonts (currently Inter and Poppins)

### Animation Speed
Edit keyframes in `tailwind.config.js` or individual component transition props

## 🔐 Authentication

The app uses JWT tokens stored in `localStorage`. Authentication context manages:
- Token storage and retrieval
- User state persistence
- Login/logout flows
- Protected routes (handled by components)

Tokens are automatically attached to all API requests via Axios interceptor.

## 📱 Responsive Breakpoints

- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

## 🚨 Error Handling

API errors are caught and displayed in user-friendly alert boxes. Check browser console for detailed error logs.

## 🔄 State Management

- **Authentication**: React Context API (`AuthContext`)
- **Component State**: React Hooks (`useState`, `useEffect`)
- **API Caching**: Currently client-side only (can add SWR/React Query for advanced caching)

## 🎯 Performance

- Next.js automatic code splitting
- Image optimization with next/image
- CSS optimization with Tailwind
- Smooth animations with Framer Motion (GPU accelerated)

## 📝 Best Practices

- Use `'use client'` for interactive components (React 18 client components)
- Use `'use server'` for server-side operations
- Leverage TypeScript for type safety
- Use Tailwind utility classes for styling
- Keep components focused and reusable

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License

## 🆘 Troubleshooting

### Backend connection issues
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in backend
- Check `.env.local` API_URL configuration

### Login/Auth issues
- Clear localStorage: `localStorage.clear()`
- Ensure backend JWT secret is configured
- Check token expiry time

### Styling issues
- Restart dev server: `npm run dev`
- Clear `.next` folder
- Ensure Tailwind CSS is compiled

## 📞 Support

For issues, check the backend README and API documentation.
