import React, { useState, useEffect } from 'react';

function CandidateInterviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    // TODO: Fetch scheduled interviews for the candidate from the backend
    // This would call an endpoint like GET /api/applications/me which includes interview details.
    const dummyInterviews = [
      { InterviewID: 1, JobTitle: 'Software Engineer', CompanyName: 'Tech Corp', ScheduledDate: '2025-12-15T10:00:00Z', Mode: 'Online' },
    ];
    setInterviews(dummyInterviews);
  }, []);

  return (
    <div>
      <h2>My Scheduled Interviews</h2>
      {interviews.map(interview => (
        <div key={interview.InterviewID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{interview.JobTitle} at {interview.CompanyName}</h3>
          <p>Date: {new Date(interview.ScheduledDate).toLocaleString()}</p>
          <p>Mode: {interview.Mode}</p>
        </div>
      ))}
    </div>
  );
}

export default CandidateInterviews;