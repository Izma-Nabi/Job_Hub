import React, { useState, useEffect } from 'react';

function ViewApplicants() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // TODO: Fetch applicants for the company's jobs.
    // This would likely be a route like GET /api/company/me/applicants
    // It might need a dropdown to select a specific job.
    const dummyApplicants = [
      { ApplicationID: 1, FullName: 'John Doe', JobTitle: 'Software Engineer', AppliedAt: '2025-11-20' },
      { ApplicationID: 2, FullName: 'Jane Smith', JobTitle: 'Software Engineer', AppliedAt: '2025-11-21' },
    ];
    setApplicants(dummyApplicants);
  }, []);

  return (
    <div>
      <h2>Job Applicants</h2>
      {/* TODO: Add a filter/select for specific jobs */}
      {applicants.map(app => (
        <div key={app.ApplicationID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{app.FullName} for {app.JobTitle}</h3>
          <p>Applied on: {app.AppliedAt}</p>
          <button>View Resume</button>
          <button>Shortlist for Interview</button>
        </div>
      ))}
    </div>
  );
}

export default ViewApplicants;