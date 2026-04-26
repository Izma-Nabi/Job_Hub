import React, { useState, useEffect } from 'react';

function Shortlist() {
  const [shortlisted, setShortlisted] = useState([]);

  useEffect(() => {
    // TODO: Fetch candidates whose application status is 'Reviewed' or similar.
    // This page is for scheduling interviews.
    const dummyShortlist = [
      { ApplicationID: 1, FullName: 'John Doe', JobTitle: 'Software Engineer' },
    ];
    setShortlisted(dummyShortlist);
  }, []);

  const scheduleInterview = (applicationId) => {
    // TODO: Implement logic to open a form/modal to schedule the interview.
    // This will call the POST /api/applications/:applicationId/interview endpoint.
    console.log(`Scheduling interview for application ${applicationId}`);
  };

  return (
    <div>
      <h2>Shortlisted Candidates for Interview</h2>
      {shortlisted.map(app => (
        <div key={app.ApplicationID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{app.FullName} - {app.JobTitle}</h3>
          <button onClick={() => scheduleInterview(app.ApplicationID)}>Schedule Interview</button>
        </div>
      ))}
    </div>
  );
}

export default Shortlist;