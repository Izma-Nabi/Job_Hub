import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function CandidateDashboard() {
  // This component would wrap the other candidate pages, providing a consistent sidebar.
  return (
    <div>
      <h1>Candidate Dashboard</h1>
      <nav style={{ float: 'left', width: '200px', background: '#f4f4f4', padding: '1rem' }}>
        <ul>
          <li><Link to="/candidate/dashboard/profile">Profile</Link></li>
          <li><Link to="/candidate/dashboard/jobs">All Jobs</Link></li>
          <li><Link to="/candidate/dashboard/interviews">My Interviews</Link></li>
          <li><Link to="/candidate/dashboard/response">Interview Responses</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>
      <main style={{ marginLeft: '220px', padding: '1rem' }}>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default CandidateDashboard;