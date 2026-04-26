import React from 'react';

function CandidateProfile() {
  // TODO:
  // 1. Fetch candidate data from the backend using a token.
  // 2. Populate the form with the fetched data.
  // 3. Implement an 'onSave' function to call the PUT /api/candidate/me endpoint.

  return (
    <div>
      <h2>My Profile</h2>
      <form>
        <label>Full Name:</label>
        <input type="text" name="fullName" />
        <label>Email:</label>
        <input type="email" name="email" readOnly />
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" />
        <label>Skills (comma-separated):</label>
        <input type="text" name="skills" />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default CandidateProfile;