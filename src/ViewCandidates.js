import React, { useState, useEffect } from 'react';

function ViewCandidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // TODO: Fetch all candidates from the backend (e.g., GET /api/admin/candidates)
    const dummyCandidates = [
      { CandidateID: 1, FullName: 'John Doe', Email: 'john.d@example.com' },
      { CandidateID: 2, FullName: 'Jane Smith', Email: 'jane.s@example.com' },
    ];
    setCandidates(dummyCandidates);
  }, []);

  return (
    <div>
      <h2>All Candidates</h2>
      {candidates.map(candidate => (
        <div key={candidate.CandidateID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{candidate.FullName}</h3>
          <p>Email: {candidate.Email}</p>
        </div>
      ))}
    </div>
  );
}

export default ViewCandidates;