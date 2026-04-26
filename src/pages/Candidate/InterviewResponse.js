import React, { useState, useEffect } from 'react';

function InterviewResponse() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // TODO: Fetch application statuses from the backend (e.g., GET /api/applications/me)
    // This will show whether an application is 'Accepted', 'Rejected', etc.
    const dummyResponses = [
      { ApplicationID: 1, JobTitle: 'Software Engineer', CompanyName: 'Tech Corp', Status: 'Accepted' },
      { ApplicationID: 2, JobTitle: 'UX Designer', CompanyName: 'Design Co', Status: 'Rejected' },
    ];
    setApplications(dummyResponses);
  }, []);

  return (
    <div>
      <h2>Application Responses</h2>
      {applications.map(app => (
        <div key={app.ApplicationID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{app.JobTitle} at {app.CompanyName}</h3>
          <p>Status: <strong>{app.Status}</strong></p>
        </div>
      ))}
    </div>
  );
}

export default InterviewResponse;