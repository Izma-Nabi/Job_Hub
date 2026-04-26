import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav style={{ float: 'left', width: '200px', background: '#f4f4f4', padding: '1rem' }}>
        <ul>
          <li><Link to="/admin/companies">View Companies</Link></li>
          <li><Link to="/admin/candidates">View Candidates</Link></li>
          <li><Link to="/admin/verification">Company Verification</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>
      <main style={{ marginLeft: '220px', padding: '1rem' }}>
        <Outlet />
        <p>Welcome, Admin. Use the sidebar to manage the portal.</p>
      </main>
    </div>
  );
}

export default AdminDashboard;