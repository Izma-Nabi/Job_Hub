import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function CompanyDashboard() {
  return (
    <div>
      <h1>Company Dashboard</h1>
      <nav style={{ float: 'left', width: '200px', background: '#f4f4f4', padding: '1rem' }}>
        <ul>
          <li><Link to="/company/dashboard/profile">Company Profile</Link></li>
          <li><Link to="/company/dashboard/create-job">Create Job</Link></li>
          <li><Link to="/company/dashboard/applicants">View Applicants</Link></li>
          <li><Link to="/company/dashboard/shortlist">Shortlist Candidates</Link></li>
          <li><Link to="/company/dashboard/response">Submit Response</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>
      <main style={{ marginLeft: '220px', padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default CompanyDashboard;