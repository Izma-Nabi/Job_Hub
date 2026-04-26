import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Common/LandingPage';
import LoginPage from './pages/Common/LoginPage';
import RegisterPage from './pages/Common/RegisterPage';

// Candidate Imports
import CandidateDashboard from './pages/Candidate/CandidateDashboard';
import CandidateProfile from './pages/Candidate/CandidateProfile';
import AllJobs from './pages/Candidate/AllJobs';
import CandidateInterviews from './pages/Candidate/CandidateInterviews';
import InterviewResponse from './pages/Candidate/InterviewResponse';

// Company Imports
import CompanyDashboard from './pages/Company/CompanyDashboard';
import CompanyProfile from './pages/Company/CompanyProfile';
import CreateJob from './pages/Company/CreateJob';
import ViewApplicants from './pages/Company/ViewApplicants';
import Shortlist from './pages/Company/Shortlist';
import SubmitResponse from './pages/Company/SubmitResponse';

// Admin Imports
import AdminDashboard from './pages/Admin/AdminDashboard';
import ViewCompanies from './pages/Admin/ViewCompanies';
import ViewCandidates from './pages/Admin/ViewCandidates';
import Verification from './pages/Admin/Verification';

function App() {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Candidate Routes */}

        <Route path="/candidate/dashboard" element={<CandidateDashboard />}>
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="jobs" element={<AllJobs />} />
          <Route path="interviews" element={<CandidateInterviews />} />
          <Route path="response" element={<InterviewResponse />} />
          <Route index element={<Navigate to="profile" replace />} />
        </Route>

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<CompanyDashboard />}>
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="applicants" element={<ViewApplicants />} />
          <Route path="shortlist" element={<Shortlist />} />
          <Route path="response" element={<SubmitResponse />} />
          <Route index element={<Navigate to="profile" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/companies" element={<ViewCompanies />} />
        <Route path="/admin/candidates" element={<ViewCandidates />} />
        <Route path="/admin/verification" element={<Verification />} />
      </Routes>
    </Router>
  );
}

export default App;