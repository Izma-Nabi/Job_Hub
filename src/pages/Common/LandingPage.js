import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  // This page will have options to log in or register as a specific role.
  return (
    <div>
      <h1>Welcome to the Job Portal</h1>
      <p>Find your next opportunity or the perfect candidate.</p>
      <div>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Sign Up</button></Link>
      </div>
    </div>
  );
}

export default LandingPage;