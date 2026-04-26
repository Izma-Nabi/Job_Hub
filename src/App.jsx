/*
Job Portal Frontend (React) - Single-file starter
Place this file at: frontend/src/App.jsx

This is a self-contained React + Tailwind starter implementing:
- Landing page with Admin / Candidate / Company login buttons
- Candidate & Company signup and login flows (mocked with localStorage)
- First-login registration flow (complete profile after initial auth)
- Candidate dashboard: Profile (editable), Jobs (list + detail + apply), Interviews, Interview Responses
- Company dashboard: Profile, Create Job, View Applicants, Shortlist for interview, Submit response
- Admin dashboard: View all companies, all candidates, verification (recent logins)

Notes:
- This is a frontend-only mock. All persistence is via localStorage to ease integration.
- Integrate with your backend by replacing the `api` functions (search for `// TODO: replace with real API`)
- Uses React Router v6-style routing and Tailwind classes. Ensure Tailwind is configured in your project.

How to run:
1. Create React app (Vite or CRA) and add Tailwind.
2. Put this file at frontend/src/App.jsx, and import it in main.jsx/index.jsx.
3. Start dev server.

This single-file is intentionally large to make it easy to drop into your frontend folder. You can split into components later.
*/

import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

// ---------------------- Mock API (localStorage) ----------------------
const STORAGE_KEYS = {
  companies: "jp_companies",
  candidates: "jp_candidates",
  admins: "jp_admins",
  jobs: "jp_jobs",
  applications: "jp_applications",
  interviews: "jp_interviews",
  notifications: "jp_notifications",
  sessions: "jp_sessions",
};

function load(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// seed admin if none
if (load(STORAGE_KEYS.admins).length === 0) {
  save(STORAGE_KEYS.admins, [{ AdminID: 1, Username: "admin", PasswordHash: "admin", CreatedAt: new Date() }]);
}

const api = {
  // auth: returns { role, id, firstLogin }
  login: ({ role, username, password }) => {
    if (role === "admin") {
      const admins = load(STORAGE_KEYS.admins);
      const a = admins.find((x) => x.Username === username && x.PasswordHash === password);
      if (a) return { role: "admin", id: a.AdminID, firstLogin: false };
    }
    if (role === "company") {
      const companies = load(STORAGE_KEYS.companies);
      const c = companies.find((x) => x.Email === username && x.PasswordHash === password);
      if (c) return { role: "company", id: c.CompanyID, firstLogin: false, isVerified: c.IsVerified };
    }
    if (role === "candidate") {
      const candidates = load(STORAGE_KEYS.candidates);
      const u = candidates.find((x) => x.Email === username && x.PasswordHash === password);
      if (u) return { role: "candidate", id: u.CandidateID, firstLogin: false };
    }
    return null;
  },
  signupCandidate: ({ fullName, email, password }) => {
    const candidates = load(STORAGE_KEYS.candidates);
    if (candidates.find((c) => c.Email === email)) return { error: "Email already used" };
    const id = (candidates.length ? candidates[candidates.length - 1].CandidateID : 0) + 1;
    const rec = { CandidateID: id, FullName: fullName, Email: email, PasswordHash: password, PhoneNumber: "", Skills: "", ResumeLink: "", CoverLetter: "", ExperienceYears: 0, IsActive: 1, CreatedAt: new Date() };
    candidates.push(rec);
    save(STORAGE_KEYS.candidates, candidates);
    return { role: "candidate", id };
  },
  signupCompany: ({ companyName, email, password }) => {
    const companies = load(STORAGE_KEYS.companies);
    if (companies.find((c) => c.Email === email)) return { error: "Email already used" };
    const id = (companies.length ? companies[companies.length - 1].CompanyID : 0) + 1;
    const rec = { CompanyID: id, CompanyName: companyName, Email: email, PasswordHash: password, PhoneNumber: "", Industry: "", Location: "", Website: "", Description: "", IsVerified: 0, IsActive: 1, CreatedAt: new Date() };
    companies.push(rec);
    save(STORAGE_KEYS.companies, companies);
    return { role: "company", id };
  },

  getCandidate: (id) => load(STORAGE_KEYS.candidates).find((c) => c.CandidateID === id),
  updateCandidate: (id, patch) => {
    const items = load(STORAGE_KEYS.candidates);
    const idx = items.findIndex((c) => c.CandidateID === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    save(STORAGE_KEYS.candidates, items);
    return items[idx];
  },

  getCompany: (id) => load(STORAGE_KEYS.companies).find((c) => c.CompanyID === id),
  updateCompany: (id, patch) => {
    const items = load(STORAGE_KEYS.companies);
    const idx = items.findIndex((c) => c.CompanyID === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    save(STORAGE_KEYS.companies, items);
    return items[idx];
  },

  createJob: (companyId, job) => {
    const jobs = load(STORAGE_KEYS.jobs);
    const id = (jobs.length ? jobs[jobs.length - 1].JobID : 0) + 1;
    const rec = { JobID: id, CompanyID: companyId, ...job, PostedAt: new Date(), IsActive: 1 };
    jobs.push(rec);
    save(STORAGE_KEYS.jobs, jobs);
    return rec;
  },
  listJobs: () => load(STORAGE_KEYS.jobs).filter((j) => j.IsActive),
  getJob: (id) => load(STORAGE_KEYS.jobs).find((j) => j.JobID === id),

  applyJob: ({ candidateId, jobId, resumeLink, coverLetter }) => {
    const applications = load(STORAGE_KEYS.applications);
    const id = (applications.length ? applications[applications.length - 1].ApplicationID : 0) + 1;
    const rec = { ApplicationID: id, CandidateID: candidateId, JobID: jobId, ResumeLink: resumeLink, CoverLetter: coverLetter, Status: "Pending", AppliedAt: new Date() };
    applications.push(rec);
    save(STORAGE_KEYS.applications, applications);
    return rec;
  },
  getApplicationsForJob: (jobId) => load(STORAGE_KEYS.applications).filter((a) => a.JobID === jobId),
  getApplicationsForCandidate: (candidateId) => load(STORAGE_KEYS.applications).filter((a) => a.CandidateID === candidateId),
  updateApplicationStatus: (applicationId, status) => {
    const applications = load(STORAGE_KEYS.applications);
    const idx = applications.findIndex((a) => a.ApplicationID === applicationId);
    if (idx === -1) return null;
    applications[idx].Status = status;
    save(STORAGE_KEYS.applications, applications);
    return applications[idx];
  },

  scheduleInterview: ({ applicationId, scheduledDate, location, mode }) => {
    const interviews = load(STORAGE_KEYS.interviews);
    const id = (interviews.length ? interviews[interviews.length - 1].InterviewID : 0) + 1;
    const rec = { InterviewID: id, ApplicationID: applicationId, ScheduledDate: scheduledDate, Location: location, Mode: mode, Status: "Scheduled" };
    interviews.push(rec);
    save(STORAGE_KEYS.interviews, interviews);
    return rec;
  },
  getInterviewsForCandidate: (candidateId) => {
    const applications = load(STORAGE_KEYS.applications).filter((a) => a.CandidateID === candidateId);
    const interviews = load(STORAGE_KEYS.interviews);
    return interviews.filter((i) => applications.some((a) => a.ApplicationID === i.ApplicationID));
  },
  getInterviewsForCompany: (companyId) => {
    const jobs = load(STORAGE_KEYS.jobs).filter((j) => j.CompanyID === companyId);
    const applications = load(STORAGE_KEYS.applications).filter((a) => jobs.some((j) => j.JobID === a.JobID));
    const interviews = load(STORAGE_KEYS.interviews);
    return interviews.filter((i) => applications.some((a) => a.ApplicationID === i.ApplicationID));
  },

  listCompanies: () => load(STORAGE_KEYS.companies),
  listCandidates: () => load(STORAGE_KEYS.candidates),
  recentCompanyLogins: () => {
    const sessions = load(STORAGE_KEYS.sessions);
    // sessions stored as [{companyId, at}]
    return sessions.filter((s) => s.role === "company").sort((a,b)=> new Date(b.at)-new Date(a.at)).slice(0,20);
  },

  recordSession: ({ role, id }) => {
    const sessions = load(STORAGE_KEYS.sessions);
    sessions.push({ role, id, at: new Date() });
    save(STORAGE_KEYS.sessions, sessions);
  }
};

// ---------------------- Auth Context ----------------------
const AuthContext = createContext();
function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("jp_current_user") || "null"));
  const login = (payload) => {
    localStorage.setItem("jp_current_user", JSON.stringify(payload));
    setUser(payload);
  };
  const logout = () => {
    localStorage.removeItem("jp_current_user");
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

// ---------------------- Small UI components ----------------------
function Card({ children, className = "" }) {
  return <div className={"p-4 bg-white shadow rounded " + className}>{children}</div>;
}

function Sidebar({ items, active }) {
  return (
    <div className="w-64 p-4 border-r min-h-screen">
      <nav className="space-y-2">
        {items.map((it) => (
          <Link key={it.key} to={it.to} className={"block p-2 rounded " + (active === it.key ? "bg-slate-200" : "hover:bg-slate-100")}>
            {it.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

// ---------------------- Pages ----------------------
function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-4xl p-8">
        <div className="flex gap-6 items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">Job Portal - Choose your role</h1>
            <p className="mb-6">Login as Admin, Company or Candidate. Sign up if you're a Company or Candidate.</p>
            <div className="flex gap-4">
              <Link to="/auth/select/admin" className="px-4 py-2 bg-indigo-600 text-white rounded">Admin</Link>
              <Link to="/auth/select/company" className="px-4 py-2 bg-green-600 text-white rounded">Company</Link>
              <Link to="/auth/select/candidate" className="px-4 py-2 bg-sky-600 text-white rounded">Candidate</Link>
            </div>
          </div>
          <div className="w-1/3">
            <Card>
              <h3 className="font-semibold">Quick Start</h3>
              <ol className="text-sm mt-2 list-decimal list-inside">
                <li>Sign up as company or candidate.</li>
                <li>Login and complete your profile when first prompted.</li>
                <li>Companies create jobs. Candidates apply.</li>
                <li>Companies shortlist & schedule interviews. Submit responses.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleSelect({ role }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">{role.charAt(0).toUpperCase() + role.slice(1)} - Login / Signup</h2>
          <LoginForm role={role} onFirstLogin={(payload) => { navigate(`/${role}/register`); }} />
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium">Don't have an account?</h3>
            {role !== "admin" ? (
              <Link to={`/auth/${role}/signup`} className="text-indigo-600">Sign up as {role}</Link>
            ) : (
              <div className="text-xs text-muted pt-2">Admin accounts are seeded by system.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ role, onFirstLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const res = api.login({ role, username, password });
    if (!res) return setErr("Invalid credentials");
    auth.login({ ...res, role, username });
    api.recordSession({ role, id: res.id });
    if (onFirstLogin) onFirstLogin(res);
    if (role === "candidate") navigate(`/candidate/dashboard`);
    if (role === "company") navigate(`/company/dashboard`);
    if (role === "admin") navigate(`/admin`);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">Username / Email
        <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full border rounded p-2 mt-1" />
      </label>
      <label className="block text-sm">Password
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded p-2 mt-1" />
      </label>
      {err && <div className="text-red-600">{err}</div>}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
      </div>
    </form>
  );
}

function SignupCandidate() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const res = api.signupCandidate({ fullName, email, password });
    if (res.error) return setMsg(res.error);
    setMsg("Account created. Redirecting to candidate registration...");
    navigate(`/candidate/register`, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Candidate Sign up</h2>
          <form onSubmit={submit} className="space-y-3">
            <label className="block">Full name<input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full border rounded p-2 mt-1"/></label>
            <label className="block">Email<input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded p-2 mt-1"/></label>
            <label className="block">Password<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded p-2 mt-1"/></label>
            <div><button className="px-4 py-2 bg-green-600 text-white rounded">Create account</button></div>
            {msg && <div className="text-sm text-indigo-600">{msg}</div>}
          </form>
        </Card>
      </div>
    </div>
  );
}

function SignupCompany() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const res = api.signupCompany({ companyName, email, password });
    if (res.error) return setMsg(res.error);
    setMsg("Account created. Redirecting to company registration...");
    navigate(`/company/register`, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Company Sign up</h2>
          <form onSubmit={submit} className="space-y-3">
            <label className="block">Company name<input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} className="w-full border rounded p-2 mt-1"/></label>
            <label className="block">Email<input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded p-2 mt-1"/></label>
            <label className="block">Password<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded p-2 mt-1"/></label>
            <div><button className="px-4 py-2 bg-green-600 text-white rounded">Create company</button></div>
            {msg && <div className="text-sm text-indigo-600">{msg}</div>}
          </form>
        </Card>
      </div>
    </div>
  );
}

function CandidateRegisterFirstTime() {
  const auth = useAuth();
  const navigate = useNavigate();
  const user = auth.user;
  const [profile, setProfile] = useState({ FullName: "", PhoneNumber: "", Skills: "", ResumeLink: "", CoverLetter: "", ExperienceYears: 0 });

  useEffect(()=>{
    if (!user) navigate('/');
    const c = api.getCandidate(user?.id);
    if (c) setProfile(c);
  },[]);

  const submit = (e)=>{
    e.preventDefault();
    api.updateCandidate(user.id, profile);
    navigate('/candidate/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-lg p-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Complete Candidate Profile</h2>
          <form onSubmit={submit} className="space-y-3">
            <input value={profile.FullName||""} onChange={(e)=>setProfile({...profile, FullName: e.target.value})} className="w-full border p-2 rounded" placeholder="Full name" />
            <input value={profile.PhoneNumber||""} onChange={(e)=>setProfile({...profile, PhoneNumber: e.target.value})} className="w-full border p-2 rounded" placeholder="Phone number" />
            <input value={profile.Skills||""} onChange={(e)=>setProfile({...profile, Skills: e.target.value})} className="w-full border p-2 rounded" placeholder="Comma separated skills" />
            <input value={profile.ResumeLink||""} onChange={(e)=>setProfile({...profile, ResumeLink: e.target.value})} className="w-full border p-2 rounded" placeholder="Resume link" />
            <textarea value={profile.CoverLetter||""} onChange={(e)=>setProfile({...profile, CoverLetter: e.target.value})} className="w-full border p-2 rounded" placeholder="Cover letter" />
            <div className="flex gap-2"><button className="px-4 py-2 bg-indigo-600 text-white rounded">Save profile</button></div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function CompanyRegisterFirstTime() {
  const auth = useAuth();
  const navigate = useNavigate();
  const user = auth.user;
  const [profile, setProfile] = useState({ CompanyName: "", PhoneNumber: "", Industry: "", Location: "", Website: "", Description: "" });

  useEffect(()=>{
    if (!user) navigate('/');
    const c = api.getCompany(user?.id);
    if (c) setProfile(c);
  },[]);

  const submit = (e)=>{
    e.preventDefault();
    api.updateCompany(user.id, profile);
    navigate('/company/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-lg p-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Complete Company Profile</h2>
          <form onSubmit={submit} className="space-y-3">
            <input value={profile.CompanyName||""} onChange={(e)=>setProfile({...profile, CompanyName: e.target.value})} className="w-full border p-2 rounded" placeholder="Company name" />
            <input value={profile.PhoneNumber||""} onChange={(e)=>setProfile({...profile, PhoneNumber: e.target.value})} className="w-full border p-2 rounded" placeholder="Phone number" />
            <input value={profile.Industry||""} onChange={(e)=>setProfile({...profile, Industry: e.target.value})} className="w-full border p-2 rounded" placeholder="Industry" />
            <input value={profile.Location||""} onChange={(e)=>setProfile({...profile, Location: e.target.value})} className="w-full border p-2 rounded" placeholder="Location" />
            <input value={profile.Website||""} onChange={(e)=>setProfile({...profile, Website: e.target.value})} className="w-full border p-2 rounded" placeholder="Website" />
            <textarea value={profile.Description||""} onChange={(e)=>setProfile({...profile, Description: e.target.value})} className="w-full border p-2 rounded" placeholder="Description" />
            <div className="flex gap-2"><button className="px-4 py-2 bg-indigo-600 text-white rounded">Save profile</button></div>
          </form>
        </Card>
      </div>
    </div>
  );
}

// ---------------------- Candidate Dashboard ----------------------
function CandidateDashboard() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  const [active, setActive] = useState('profile');

  useEffect(()=>{ if(!user) navigate('/'); },[]);

  const items = [
    { key: 'profile', label: 'Profile', to: '/candidate/dashboard/profile' },
    { key: 'jobs', label: 'All Jobs', to: '/candidate/dashboard/jobs' },
    { key: 'interviews', label: 'Interviews', to: '/candidate/dashboard/interviews' },
    { key: 'responses', label: 'Responses', to: '/candidate/dashboard/responses' }
  ];

  return (
    <div className="flex">
      <Sidebar items={items} active={active} />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Candidate Dashboard</h2>
          <div>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>{auth.logout(); navigate('/')}}>Logout</button>
          </div>
        </div>
        <Routes>
          <Route path="profile" element={<CandidateProfile setActive={setActive} />} />
          <Route path="jobs" element={<CandidateJobs setActive={setActive} />} />
          <Route path="jobs/:id" element={<CandidateJobDetail setActive={setActive} />} />
          <Route path="interviews" element={<CandidateInterviews setActive={setActive} />} />
          <Route path="responses" element={<CandidateResponses setActive={setActive} />} />
          <Route index element={<Navigate to="profile" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function CandidateProfile({ setActive }) {
  const auth = useAuth();
  const u = api.getCandidate(auth.user.id);
  const [profile, setProfile] = useState(u || {});
  useEffect(()=>setActive('profile'),[]);
  const save = ()=>{ api.updateCandidate(auth.user.id, profile); alert('Saved'); };
  return (
    <div>
      <h3 className="font-semibold">Profile</h3>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <input value={profile.FullName||''} onChange={(e)=>setProfile({...profile, FullName: e.target.value})} className="border p-2 rounded" />
        <input value={profile.Email||''} disabled className="border p-2 rounded bg-slate-50" />
        <input value={profile.PhoneNumber||''} onChange={(e)=>setProfile({...profile, PhoneNumber: e.target.value})} className="border p-2 rounded" />
        <input value={profile.Skills||''} onChange={(e)=>setProfile({...profile, Skills: e.target.value})} className="border p-2 rounded" />
        <input value={profile.ResumeLink||''} onChange={(e)=>setProfile({...profile, ResumeLink: e.target.value})} className="border p-2 rounded" />
        <textarea value={profile.CoverLetter||''} onChange={(e)=>setProfile({...profile, CoverLetter: e.target.value})} className="border p-2 rounded col-span-2" />
      </div>
      <div className="mt-3"><button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded">Update</button></div>
    </div>
  );
}

function CandidateJobs({ setActive }) {
  useEffect(()=>setActive('jobs'),[]);
  const jobs = api.listJobs();
  return (
    <div>
      <h3 className="font-semibold">All Jobs</h3>
      <div className="mt-3 grid grid-cols-1 gap-3">
        {jobs.map((j)=> (
          <Card key={j.JobID} className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{j.Title}</div>
              <div className="text-sm text-slate-600">{j.Description?.slice(0,120)}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/candidate/dashboard/jobs/${j.JobID}`} className="px-3 py-1 bg-slate-800 text-white rounded">View</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CandidateJobDetail({ setActive }) {
  useEffect(()=>setActive('jobs'),[]);
  const { pathname } = window.location;
  const id = Number(pathname.split('/').pop());
  const job = api.getJob(id);
  const auth = useAuth();
  const [applied, setApplied] = useState(false);
  useEffect(()=>{ const apps = api.getApplicationsForCandidate(auth.user.id); setApplied(apps.some(a=>a.JobID===id)); },[]);
  const apply = ()=>{
    const resume = prompt('Enter resume link (or leave blank)');
    const cover = prompt('Cover letter');
    api.applyJob({ candidateId: auth.user.id, jobId: id, resumeLink: resume||'', coverLetter: cover||'' });
    alert('Applied'); setApplied(true);
  };
  if(!job) return <div>Job not found</div>;
  return (
    <div>
      <h3 className="text-lg font-semibold">{job.Title}</h3>
      <div className="mt-2">{job.Description}</div>
      <div className="mt-2 text-sm text-slate-600">Requirements: {job.Requirements}</div>
      <div className="mt-3">{applied ? <span className="px-3 py-1 bg-green-100 rounded">Already applied</span> : <button onClick={apply} className="px-3 py-1 bg-indigo-600 text-white rounded">Apply</button>}</div>
    </div>
  );
}

function CandidateInterviews({ setActive }) {
  useEffect(()=>setActive('interviews'),[]);
  const auth = useAuth();
  const interviews = api.getInterviewsForCandidate(auth.user.id);
  return (
    <div>
      <h3 className="font-semibold">Interviews</h3>
      <div className="mt-3 space-y-3">
        {interviews.length===0 && <div>No interviews scheduled</div>}
        {interviews.map(i=> (
          <Card key={i.InterviewID}>
            <div>Interview ID: {i.InterviewID}</div>
            <div>When: {new Date(i.ScheduledDate).toLocaleString()}</div>
            <div>Mode: {i.Mode} | Location: {i.Location}</div>
            <div>Status: {i.Status}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CandidateResponses({ setActive }) {
  useEffect(()=>setActive('responses'),[]);
  const auth = useAuth();
  const apps = api.getApplicationsForCandidate(auth.user.id);
  return (
    <div>
      <h3 className="font-semibold">Application Responses</h3>
      <div className="mt-3 space-y-2">
        {apps.map(a=> (
          <Card key={a.ApplicationID}>
            <div>Job ID: {a.JobID} | Status: {a.Status}</div>
            <div>Applied at: {new Date(a.AppliedAt).toLocaleString()}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------- Company Dashboard ----------------------
function CompanyDashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('profile');
  useEffect(()=>{ if(!auth.user) navigate('/'); },[]);
  const items = [
    { key: 'profile', label: 'Profile', to: '/company/dashboard/profile' },
    { key: 'create', label: 'Create Job', to: '/company/dashboard/create' },
    { key: 'applicants', label: 'Look for Candidates', to: '/company/dashboard/applicants' },
    { key: 'shortlist', label: 'Shortlist / Interviews', to: '/company/dashboard/shortlist' },
    { key: 'responses', label: 'Submit Responses', to: '/company/dashboard/responses' }
  ];
  return (
    <div className="flex">
      <Sidebar items={items} active={active} />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Company Dashboard</h2>
          <div>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>{auth.logout(); navigate('/')}}>Logout</button>
          </div>
        </div>
        <Routes>
          <Route path="profile" element={<CompanyProfile setActive={setActive} />} />
          <Route path="create" element={<CompanyCreateJob setActive={setActive} />} />
          <Route path="applicants" element={<CompanyApplicants setActive={setActive} />} />
          <Route path="shortlist" element={<CompanyShortlist setActive={setActive} />} />
          <Route path="responses" element={<CompanyResponses setActive={setActive} />} />
          <Route index element={<Navigate to="profile" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function CompanyProfile({ setActive }) {
  useEffect(()=>setActive('profile'),[]);
  const auth = useAuth();
  const comp = api.getCompany(auth.user.id);
  const [profile, setProfile] = useState(comp || {});
  const save = () => { api.updateCompany(auth.user.id, profile); alert('Saved'); };
  return (
    <div>
      <h3 className="font-semibold">Company Profile</h3>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <input value={profile.CompanyName||''} onChange={(e)=>setProfile({...profile, CompanyName: e.target.value})} className="border p-2 rounded" />
        <input value={profile.Email||''} disabled className="border p-2 rounded bg-slate-50" />
        <input value={profile.PhoneNumber||''} onChange={(e)=>setProfile({...profile, PhoneNumber: e.target.value})} className="border p-2 rounded" />
        <input value={profile.Industry||''} onChange={(e)=>setProfile({...profile, Industry: e.target.value})} className="border p-2 rounded" />
        <input value={profile.Location||''} onChange={(e)=>setProfile({...profile, Location: e.target.value})} className="border p-2 rounded" />
        <input value={profile.Website||''} onChange={(e)=>setProfile({...profile, Website: e.target.value})} className="border p-2 rounded" />
        <textarea value={profile.Description||''} onChange={(e)=>setProfile({...profile, Description: e.target.value})} className="border p-2 rounded col-span-2" />
      </div>
      <div className="mt-3"><button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded">Update</button></div>
    </div>
  );
}

function CompanyCreateJob({ setActive }) {
  useEffect(()=>setActive('create'),[]);
  const auth = useAuth();
  const [job, setJob] = useState({ Title: '', Description: '', Requirements: '', Location: '', SalaryRange: '', EmploymentType: 'Full-time', Deadline: '' });
  const submit = (e) => { e.preventDefault(); api.createJob(auth.user.id, job); alert('Job created'); setJob({ Title: '', Description: '', Requirements: '', Location: '', SalaryRange: '', EmploymentType: 'Full-time', Deadline: '' }); };
  return (
    <div>
      <h3 className="font-semibold">Create Job</h3>
      <form onSubmit={submit} className="mt-3 grid grid-cols-2 gap-3">
        <input placeholder="Title" value={job.Title} onChange={(e)=>setJob({...job, Title: e.target.value})} className="border p-2 rounded col-span-2" />
        <textarea placeholder="Description" value={job.Description} onChange={(e)=>setJob({...job, Description: e.target.value})} className="border p-2 rounded col-span-2" />
        <input placeholder="Requirements" value={job.Requirements} onChange={(e)=>setJob({...job, Requirements: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Location" value={job.Location} onChange={(e)=>setJob({...job, Location: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Salary Range" value={job.SalaryRange} onChange={(e)=>setJob({...job, SalaryRange: e.target.value})} className="border p-2 rounded" />
        <select value={job.EmploymentType} onChange={(e)=>setJob({...job, EmploymentType: e.target.value})} className="border p-2 rounded">
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
        <input type="date" value={job.Deadline} onChange={(e)=>setJob({...job, Deadline: e.target.value})} className="border p-2 rounded" />
        <div className="col-span-2"><button className="px-4 py-2 bg-green-600 text-white rounded">Create</button></div>
      </form>
    </div>
  );
}

function CompanyApplicants({ setActive }) {
  useEffect(()=>setActive('applicants'),[]);
  const auth = useAuth();
  const jobs = load(STORAGE_KEYS.jobs).filter(j=>j.CompanyID===auth.user.id);
  return (
    <div>
      <h3 className="font-semibold">Applicants (by job)</h3>
      <div className="mt-3 space-y-3">
        {jobs.map(j=> (
          <Card key={j.JobID}>
            <div className="font-semibold">{j.Title}</div>
            <div className="mt-2">{api.getApplicationsForJob(j.JobID).map(a=> (
              <div key={a.ApplicationID} className="border rounded p-2 mt-2">
                <div>Candidate: {api.getCandidate(a.CandidateID)?.FullName || a.CandidateID}</div>
                <div>Resume: {a.ResumeLink}</div>
                <div>Status: {a.Status}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={()=>{ api.scheduleInterview({ applicationId: a.ApplicationID, scheduledDate: new Date().toISOString(), location: 'TBD', mode: 'Online' }); alert('Interview scheduled'); }} className="px-3 py-1 bg-indigo-600 text-white rounded">Schedule interview</button>
                  <button onClick={()=>{ api.updateApplicationStatus(a.ApplicationID, 'Reviewed'); alert('Marked Reviewed'); }} className="px-3 py-1 bg-slate-200 rounded">Mark Reviewed</button>
                </div>
              </div>
            ))}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompanyShortlist({ setActive }) {
  useEffect(()=>setActive('shortlist'),[]);
  const auth = useAuth();
  const interviews = api.getInterviewsForCompany(auth.user.id);
  return (
    <div>
      <h3 className="font-semibold">Shortlisted Interviews</h3>
      <div className="mt-3 space-y-3">
        {interviews.map(i=> (
          <Card key={i.InterviewID}>
            <div>Interview ID: {i.InterviewID}</div>
            <div>Application ID: {i.ApplicationID}</div>
            <div>When: {new Date(i.ScheduledDate).toLocaleString()}</div>
            <div className="mt-2">
              <button onClick={()=>{ api.updateApplicationStatus(i.ApplicationID, 'Accepted'); alert('Marked Accepted'); }} className="px-3 py-1 bg-green-600 text-white rounded">Mark Accepted</button>
              <button onClick={()=>{ api.updateApplicationStatus(i.ApplicationID, 'Rejected'); alert('Marked Rejected'); }} className="px-3 py-1 bg-red-600 text-white rounded ml-2">Mark Rejected</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompanyResponses({ setActive }) {
  useEffect(()=>setActive('responses'),[]);
  const auth = useAuth();
  const jobs = load(STORAGE_KEYS.jobs).filter(j=>j.CompanyID===auth.user.id);
  return (
    <div>
      <h3 className="font-semibold">Submit Responses</h3>
      <div className="mt-3 space-y-3">
        {jobs.map(j=> (
          <Card key={j.JobID}>
            <div className="font-semibold">{j.Title}</div>
            {api.getApplicationsForJob(j.JobID).map(a=> (
              <div key={a.ApplicationID} className="mt-2 border rounded p-2">
                <div>Candidate: {api.getCandidate(a.CandidateID)?.FullName}</div>
                <div>Status: {a.Status}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={()=>{ api.updateApplicationStatus(a.ApplicationID, 'Accepted'); alert('Accepted'); }} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                  <button onClick={()=>{ api.updateApplicationStatus(a.ApplicationID, 'Rejected'); alert('Rejected'); }} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------- Admin ----------------------
function AdminDashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{ if(!auth.user) navigate('/'); },[]);
  const companies = api.listCompanies();
  const candidates = api.listCandidates();
  const recent = api.recentCompanyLogins();
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <div>
          <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>{auth.logout(); navigate('/')}}>Logout</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <h4 className="font-semibold">Companies</h4>
          <div className="mt-2 text-sm">
            {companies.map(c=> (<div key={c.CompanyID} className="p-1">{c.CompanyName} - {c.Email} - Verified: {c.IsVerified? 'Yes':'No'}</div>))}
          </div>
        </Card>
        <Card>
          <h4 className="font-semibold">Candidates</h4>
          <div className="mt-2 text-sm">
            {candidates.map(c=> (<div key={c.CandidateID} className="p-1">{c.FullName} - {c.Email}</div>))}
          </div>
        </Card>
        <Card>
          <h4 className="font-semibold">Recent Company Logins (verification)</h4>
          <div className="mt-2 text-sm">
            {recent.map(r=> (<div key={r.id + r.at}>{`Company ${r.id} logged in at ${new Date(r.at).toLocaleString()}`}</div>))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------- App Router ----------------------
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/select/:role" element={<AuthRoleHandler />} />
          <Route path="/auth/company/signup" element={<SignupCompany />} />
          <Route path="/auth/candidate/signup" element={<SignupCandidate />} />
          <Route path="/auth/company/login" element={<RoleSelect role="company" />} />
          <Route path="/auth/candidate/login" element={<RoleSelect role="candidate" />} />
          <Route path="/auth/select/company" element={<RoleSelect role="company" />} />
          <Route path="/auth/select/candidate" element={<RoleSelect role="candidate" />} />
          <Route path="/auth/select/admin" element={<RoleSelect role="admin" />} />

          <Route path="/candidate/register" element={<CandidateRegisterFirstTime />} />
          <Route path="/company/register" element={<CompanyRegisterFirstTime />} />

          <Route path="/candidate/dashboard/*" element={<CandidateDashboard />} />
          <Route path="/company/dashboard/*" element={<CompanyDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="*" element={<div className="p-6">Not Found. <Link to="/">Go home</Link></div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// ---------------------- Auth role handler ----------------------
function AuthRoleHandler() {
  // reads role from url param
  const params = new URLSearchParams(window.location.search);
  const role = window.location.pathname.split('/').pop();
  if (role === 'admin') return <RoleSelect role="admin" />;
  if (role === 'company') return <RoleSelect role="company" />;
  return <RoleSelect role="candidate" />;
}
