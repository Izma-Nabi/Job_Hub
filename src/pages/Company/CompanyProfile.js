import React from 'react';

function CompanyProfile() {
  // TODO:
  // 1. Fetch company data from the backend using a token (e.g., GET /api/company/me).
  // 2. Populate the form with the fetched data.
  // 3. Implement an 'onSave' function to call the PUT /api/company/me endpoint.

  return (
    <div>
      <h2>Company Profile</h2>
      <form>
        <label>Company Name:</label>
        <input type="text" name="companyName" />
        <label>Email:</label>
        <input type="email" name="email" readOnly />
        <label>Industry:</label>
        <input type="text" name="industry" />
        <label>Location:</label>
        <input type="text" name="location" />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default CompanyProfile;