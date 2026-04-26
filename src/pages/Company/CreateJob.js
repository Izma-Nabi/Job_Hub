import React from 'react';

function CreateJob() {
  const handleCreateJob = (e) => {
    e.preventDefault();
    // TODO:
    // 1. Gather form data into a state object.
    // 2. Call the backend API to create the job (POST /api/jobs).
    console.log('Creating a new job...');
  };

  return (
    <div>
      <h2>Create a New Job Posting</h2>
      <form onSubmit={handleCreateJob}>
        <label>Job Title:</label>
        <input type="text" name="title" />

        <label>Location:</label>
        <input type="text" name="location" />

        <label>Salary Range:</label>
        <input type="text" name="salaryRange" />

        <label>Employment Type:</label>
        <select name="employmentType">
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default CreateJob;