import React, { useState, useEffect } from 'react';

function SubmitResponse() {
  const [completedInterviews, setCompletedInterviews] = useState([]);

  useEffect(() => {
    // TODO: Fetch applications where the interview status is 'Completed'.
    const dummyData = [
      { ApplicationID: 1, FullName: 'John Doe', JobTitle: 'Software Engineer' },
    ];
    setCompletedInterviews(dummyData);
  }, []);

  const submitStatus = (applicationId, status) => {
    // TODO: Call the backend to update the application status.
    // PUT /api/applications/:applicationId/status with { status: 'Accepted' or 'Rejected' }
    console.log(`Submitting status '${status}' for application ${applicationId}`);
  };

  return (
    <div>
      <h2>Submit Interview Response</h2>
      {completedInterviews.map(app => (
        <div key={app.ApplicationID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{app.FullName} - {app.JobTitle}</h3>
          <button onClick={() => submitStatus(app.ApplicationID, 'Accepted')}>Accept</button>
          <button onClick={() => submitStatus(app.ApplicationID, 'Rejected')}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default SubmitResponse;