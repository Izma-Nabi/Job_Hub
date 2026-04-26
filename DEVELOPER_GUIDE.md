# 🔧 Developer Guide - JobHub Frontend Customization

Quick reference for developers to customize and extend JobHub.

---

## 📂 Directory Overview

```
frontend/
├── app/                    # Next.js 14 app directory (routing)
│   ├── layout.tsx         # Root layout (shared across all pages)
│   ├── globals.css        # Global styles with Tailwind
│   ├── page.tsx           # Home page (/)
│   ├── jobs/
│   │   ├── page.tsx       # Jobs listing (/jobs)
│   │   └── [id]/
│   │       └── page.tsx   # Job details (/jobs/:id) - Dynamic route
│   ├── login/page.tsx     # Login (/login)
│   ├── register/page.tsx  # Registration (/register)
│   └── dashboard/
│       ├── candidate/page.tsx  # Candidate dashboard
│       ├── company/page.tsx    # Company dashboard
│       └── admin/page.tsx      # Admin dashboard
├── components/             # Reusable React components
│   ├── Navbar.tsx         # Navigation bar
│   ├── HeroSection.tsx    # Hero section with animations
│   ├── JobCard.tsx        # Job listing card
│   ├── JobCardSkeleton.tsx # Loading skeleton
│   └── ApplyForm.tsx      # Job application form
├── context/               # React Context for state management
│   └── AuthContext.tsx    # Authentication context (login/logout)
├── lib/                   # Utilities and helpers
│   └── api.ts            # Axios HTTP client & API functions
├── public/                # Static files (images, icons, etc)
└── package.json          # Dependencies and scripts
```

---

## 🎨 Styling & Customization

### Colors
**File**: `tailwind.config.js`

```js
colors: {
  primary: '#6366f1',      // Change to your brand color
  secondary: '#8b5cf6',    // Purple
  accent: '#ec4899',       // Pink
  dark: '#0f172a',         // Dark background
  light: '#f8fafc',        // Light background
}
```

### Fonts
**File**: `app/layout.tsx`

```tsx
// Change fonts
import { Inter, Poppins } from 'next/font/google';

// Add more fonts from Google Fonts
// Import them and add to className
```

### Animations
**File**: `tailwind.config.js` & Components

```js
// Add new animations
animation: {
  'fade-in': 'fadeIn 0.5s ease-in',
  'slide-up': 'slideUp 0.5s ease-out',
}

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
}
```

---

## 🔌 API Integration

### Adding New API Endpoints

**File**: `lib/api.ts`

```typescript
// Add to jobsApi object
export const jobsApi = {
  // ... existing methods
  searchJobs: (query: string) => 
    api.get('/jobs/search', { params: { q: query } }),
  
  getJobsByCategory: (category: string) =>
    api.get(`/jobs/category/${category}`),
};
```

### Using API in Components

```typescript
import { jobsApi } from '@/lib/api';

// In component
const response = await jobsApi.getAllJobs();
```

---

## 🔐 Authentication

### Login Flow

**File**: `app/login/page.tsx`

Current flow:
1. User enters credentials
2. Sends POST to `/auth/login`
3. Receives JWT token
4. Stores in localStorage
5. Redirects to dashboard

### Add Social Auth (Example)

```typescript
// Would require backend support
const loginWithGoogle = async (token: string) => {
  const response = await api.post('/auth/google', { token });
  // Store and redirect
};
```

---

## 🎯 Adding New Pages

### Create a New Page

1. **Create directory** (if needed):
   ```bash
   mkdir -p app/new-page
   ```

2. **Create page file**:
   ```bash
   touch app/new-page/page.tsx
   ```

3. **Add content**:
   ```typescript
   'use client';
   import React from 'react';
   
   export default function NewPage() {
     return (
       <div>
         <h1>New Page</h1>
       </div>
     );
   }
   ```

4. **Access at**: `http://localhost:3000/new-page`

---

## 🧩 Creating New Components

### Component Template

**File**: `components/MyComponent.tsx`

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-white rounded-lg"
    >
      <h3>{title}</h3>
    </motion.div>
  );
}
```

### Use Component

```typescript
import MyComponent from '@/components/MyComponent';

export default function Page() {
  return <MyComponent title="Hello" />;
}
```

---

## 🎬 Framer Motion Animations

### Basic Animation

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}     // Start state
  animate={{ opacity: 1, y: 0 }}      // End state
  transition={{ duration: 0.5 }}       // Timing
>
  Animated content
</motion.div>
```

### Hover Animation

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Staggered Animation

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Delay between children
    },
  },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {/* Children will animate with stagger */}
</motion.div>
```

---

## 🔄 State Management

### Using Auth Context

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, logout, login } = useAuth();
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(user, token)}>Login</button>
      )}
    </div>
  );
}
```

### Adding New Context

Create `context/MyContext.tsx`:

```typescript
'use client';

import React, { createContext, useContext } from 'react';

const MyContext = createContext(undefined);

export function MyProvider({ children }: { children: React.ReactNode }) {
  const value = { /* your state */ };
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be within MyProvider');
  }
  return context;
}
```

Then wrap in `app/layout.tsx`:
```typescript
<MyProvider>
  {children}
</MyProvider>
```

---

## 📋 Common Tasks

### Task 1: Change Color Scheme

1. Edit `tailwind.config.js`
2. Update color values
3. Restart dev server
4. Colors update automatically

### Task 2: Add New Filter to Jobs

**File**: `app/jobs/page.tsx`

```typescript
// Add state
const [selectedCategory, setSelectedCategory] = useState('');

// Add select element
<select onChange={(e) => setSelectedCategory(e.target.value)}>
  <option value="">All Categories</option>
  {categories.map(cat => <option key={cat}>{cat}</option>)}
</select>

// Filter jobs
const filtered = jobs.filter(job => 
  !selectedCategory || job.category === selectedCategory
);
```

### Task 3: Add Loading Toast Notifications

Install dependency:
```bash
npm install react-hot-toast
```

Use:
```typescript
import toast from 'react-hot-toast';

toast.success('Job applied successfully!');
toast.error('Failed to apply');
toast.loading('Applying...');
```

### Task 4: Add Form Validation

Install:
```bash
npm install zod
```

Use:
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const result = schema.parse(formData);
```

---

## 🧪 Testing API Endpoints

### Using Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Make a request
4. Check request/response
5. Look for errors in Console

### Using Postman/Insomnia

1. Create POST request to `http://localhost:5000/api/auth/login`
2. Add headers: `Content-Type: application/json`
3. Add body:
   ```json
   {
     "role": "candidate",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
4. Send and check response

---

## 🐛 Debugging Tips

### Console Logging

```typescript
console.log('Component rendered', data);
console.error('Error occurred:', error);
console.table(arrayOfObjects);
```

### React DevTools

Install React DevTools browser extension to:
- Inspect components
- Check props and state
- Track component updates

### Network Debugging

1. Open DevTools → Network
2. Filter by XHR (API requests)
3. Check response status
4. View request/response data
5. Look for CORS errors

---

## 📦 Adding New Dependencies

### Install Package

```bash
npm install package-name
```

### Import in Component

```typescript
import { something } from 'package-name';
```

### Recommended Packages

- **Forms**: `react-hook-form`
- **Validation**: `zod` or `yup`
- **Notifications**: `react-hot-toast`
- **State**: `zustand` or `jotai`
- **Date**: `date-fns`
- **Utils**: `lodash` or `lodash-es`

---

## 🚀 Performance Optimization

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
/>
```

### Memoization

```typescript
import { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

---

## 📱 Responsive Design

### Tailwind Breakpoints

```typescript
// Mobile first
<div className="text-sm md:text-base lg:text-lg">
  Text size responsive
</div>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

### Hide/Show Elements

```typescript
// Show only on mobile
<div className="md:hidden">Mobile menu</div>

// Hide on mobile
<div className="hidden md:block">Desktop menu</div>
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use HTTPS in production**
3. **Sanitize user inputs**
4. **Validate on both client & server**
5. **Keep dependencies updated**
6. **Use strong JWT secrets**
7. **Implement rate limiting**
8. **CORS configuration**

---

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎓 Next Learning Steps

1. Learn TypeScript better
2. Implement better error handling
3. Add more comprehensive testing
4. Implement caching strategies
5. Add progressive web app (PWA) features
6. Implement analytics
7. Add accessibility features
8. Optimize performance metrics

---

**Happy coding!** 🚀

For questions, check the main README or explore the source code!
