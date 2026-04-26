# 📱 JobHub - User Interface Overview

## 🏠 Homepage (`/`)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Navbar (Sticky)                                      │
│ Logo | Home | Jobs | Login | Sign Up                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ⭐ HERO SECTION                                         │
│                                                         │
│     Find Your Dream Job                                 │
│     [Explore Jobs] [Get Started]                        │
│                                                         │
│     10K+ Jobs  |  5K+ Companies  |  50K+ Users         │
│                                                         │
│     ↓ Scroll to explore ↓                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📊 FEATURED OPPORTUNITIES                               │
│                                                         │
│  [Job Card 1]  [Job Card 2]  [Job Card 3]             │
│  [Job Card 4]  [Job Card 5]  [Job Card 6]             │
│                                                         │
│  [View All Jobs Button]                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ✨ WHY CHOOSE JOBHUB                                    │
│                                                         │
│  🎯 Smart Matching  |  ⚡ Quick Apply  |  📱 Mobile   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🚀 CTA SECTION                                          │
│ Ready to Take Next Step?                                │
│ [Get Started Free] [Explore Jobs]                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ © 2026 JobHub. All rights reserved.                     │
└─────────────────────────────────────────────────────────┘
```

---

## 💼 Jobs Page (`/jobs`)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Navbar                                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Job Opportunities                                       │
│ Find your perfect role among X available positions      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ FILTERS & SEARCH                                        │
├─────────────────────────────────────────────────────────┤
│ [🔍 Search jobs...]                                     │
│                                                         │
│ [📍 Location: All]  [💼 Type: All]                     │
│                                                         │
│ Active Filters: [Search: React] [Location: NY] [X]    │
└─────────────────────────────────────────────────────────┘

Showing 12 of 847 jobs

┌──────────────────┬──────────────────┬──────────────────┐
│ [Job Card]       │ [Job Card]       │ [Job Card]       │
├──────────────────┼──────────────────┼──────────────────┤
│ [Job Card]       │ [Job Card]       │ [Job Card]       │
├──────────────────┼──────────────────┼──────────────────┤
│ [Job Card]       │ [Job Card]       │ [Job Card]       │
└──────────────────┴──────────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────┐
│ © 2026 JobHub                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📄 Job Details Page (`/jobs/:id`)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Navbar                                               │
└─────────────────────────────────────────────────────────┘

[← Back to Jobs]

┌─────────────────────────────────────────────────────────┐
│ [Senior React Developer]  🌍 Remote                    │
│ Company: TechCorp Inc.                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ QUICK INFO                                              │
├──────────────┬──────────────┬──────────────┬────────────┤
│ Full-time    │ $150K-200K   │ Posted: 5d  │ Deadline... │
└──────────────┴──────────────┴──────────────┴────────────┘

📋 ABOUT THE JOB
Description text here...

📝 REQUIREMENTS
Requirements list here...

┌─────────────────────────────────────────────────────────┐
│ [Apply for This Job Button] ← BLUE GRADIENT            │
└─────────────────────────────────────────────────────────┘

[OR if click Apply:]

┌─────────────────────────────────────────────────────────┐
│ Apply for This Position                                 │
├─────────────────────────────────────────────────────────┤
│ Resume Link * [_______________________]                 │
│ Cover Letter [________________________]                 │
│                [________________________]                 │
│                [________________________]                 │
│ [Submit Application] [Cancel]                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Login Page (`/login`)

```
┌─────────────────────────────────────────────────────────┐
│                  GLASSMORPHIC CARD                      │
│                                                         │
│              Welcome Back                               │
│           Sign in to your account                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Login As:                                               │
│ [Candidate] [Company] [Admin]                           │
│                                                         │
│ Email: [_______________________]                        │
│ Password: [_______________] 👁️                         │
│                                                         │
│ [Sign In Button] ← GRADIENT                             │
│                                                         │
│ Don't have an account? [Sign up]                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Registration Page (`/register`)

```
┌─────────────────────────────────────────────────────────┐
│                  GLASSMORPHIC CARD                      │
│                                                         │
│              Create Account                             │
│          Join JobHub and start your journey             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Sign Up As:                                             │
│ [Job Seeker] [Company]                                  │
│                                                         │
│ Email: [_______________________]                        │
│                                                         │
│ [Job Seeker Only Fields]                                │
│ Full Name: [_______________________]                    │
│ Phone: [_______________________]                        │
│ Skills: [_______________________]                       │
│                                                         │
│ [Company Only Fields]                                   │
│ Company Name: [_______________________]                 │
│ Industry: [_______________________]                     │
│ Location: [_______________________]                     │
│                                                         │
│ Password: [_______________] 👁️                         │
│ Confirm Password: [_______________] 👁️                 │
│                                                         │
│ [Create Account] ← GRADIENT                             │
│                                                         │
│ Already have an account? [Sign in]                      │
└─────────────────────────────────────────────────────────┘
```

---

## 👤 Candidate Dashboard (`/dashboard/candidate`)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Navbar (with Logout)                                │
└─────────────────────────────────────────────────────────┘

Welcome, John Doe!
Manage your profile and applications

┌─────────────────────────────────────────────────────────┐
│ 👤 YOUR PROFILE               [Edit Profile]            │
├─────────────────────────────────────────────────────────┤
│ Email: john@example.com                                 │
│ Full Name: John Doe                                     │
│ Phone: +1234567890                                      │
│ Skills: React, Node.js, Python                          │
└─────────────────────────────────────────────────────────┘

┌────────────────────────────────┬────────────────────────┐
│ 💼 Browse Jobs                 │ 📄 My Applications      │
│ Find and apply for positions   │ Track your applications │
│ [Explore Jobs]                 │ [View Applications]     │
└────────────────────────────────┴────────────────────────┘
```

---

## 🏢 Company Dashboard (`/dashboard/company`)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Navbar                                               │
└─────────────────────────────────────────────────────────┘

Welcome, TechCorp Inc!
Manage your job postings and applications    [Post a Job]

┌──────────────────────┬──────────────────┬──────────────┐
│ 3 Active Postings    │ 8 Total Posts    │ 234 Apps     │
└──────────────────────┴──────────────────┴──────────────┘

┌─────────────────────────────────────────────────────────┐
│ YOUR JOB POSTINGS                                       │
├──────────────┬──────────┬────────┬────────┬──────────────┤
│ Title        │ Location │ Type   │ Status │ Actions      │
├──────────────┼──────────┼────────┼────────┼──────────────┤
│ Sr. Developer│ Remote   │ FT     │ Active │ [View]       │
│ UI Designer  │ SF, CA   │ FT     │ Active │ [View]       │
│ QA Engineer  │ NY, NY   │ PT     │ Active │ [View]       │
└──────────────┴──────────┴────────┴────────┴──────────────┘

[Post Your First Job]
```

---

## 👑 Admin Dashboard (`/dashboard/admin`)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Navbar                                               │
└─────────────────────────────────────────────────────────┘

Admin Dashboard
Monitor and manage the platform

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 2,345 Users  │ 847 Jobs     │ 12,543 Apps  │ 234 Companies│
└──────────────┴──────────────┴──────────────┴──────────────┘

┌────────────────┬────────────────┬────────────────┬────────┐
│ Users Mgmt     │ Company Verify │ Jobs Moderate  │ Analytics
│ Manage accounts│ Verify companies│ Review postings│ View data
│ [Access]       │ [Access]       │ [Access]       │ [Access]
└────────────────┴────────────────┴────────────────┴────────┘

📊 RECENT ACTIVITY
├─ New job posting from TechCorp Inc.
├─ User registration: john.doe@example.com
├─ Company verification request from StartupXYZ
├─ Job application from candidate #1234
└─ System maintenance completed
```

---

## 🎨 Design Components

### Job Card
```
┌──────────────────────────────────────┐
│ Senior React Developer               │ ← Title
│ TechCorp Inc.                        │ ← Company
│                                      │
│ Looking for experienced React devs..│ ← Description
│                                      │
│ 📍 Remote  💼 Full-time  💰 $150K+  │ ← Info
│                                      │
│ [View Details →]                     │ ← Button
└──────────────────────────────────────┘
```

### Features Section Cards
```
┌─────────────────────┐
│      🎯 Icon       │
│   Smart Matching    │ ← Title
│ AI-powered job      │ ← Description
│ recommendations... │
└─────────────────────┘
```

---

## 🔄 User Flow Diagrams

### Candidate Flow
```
Landing Page
    ↓
[Sign Up] → Registration → [Login] → Dashboard
    ↓                                    ↓
Browse Jobs → Job Details              Profile
    ↓                                    ↓
[Apply] → Confirmation              [Edit Profile]
    ↓
[View Applications] → Check Status
```

### Company Flow
```
Landing Page
    ↓
[Sign Up] → Registration → [Login] → Dashboard
    ↓                                    ↓
[Post Job] → Create Job              Manage Jobs
    ↓                                    ↓
Job Posted → [View Applications]    [Edit Job]
    ↓
Manage Candidates
```

---

## 📱 Mobile Responsive Layout

- **Navbar**: Hamburger menu on mobile
- **Hero**: Single column layout
- **Jobs Grid**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Cards**: Full width on mobile
- **Forms**: Full width inputs
- **Buttons**: Larger touch targets

---

## 🎨 Color Scheme

```
Primary:    #6366f1 (Indigo)
Secondary:  #8b5cf6 (Purple)  
Accent:     #ec4899 (Pink)
Success:    #22c55e (Green)
Error:      #ef4444 (Red)
Background: #f8fafc (Light Slate)
Dark:       #0f172a (Dark Slate)
```

---

## ⚡ Animation States

- **Page Load**: Fade in + slide up
- **Card Hover**: Lift up with shadow
- **Button Click**: Scale 0.95
- **Loading**: Skeleton pulse
- **Success**: Checkmark animation
- **Error**: Shake animation

---

This overview provides a visual guide to all user interfaces in JobHub!
