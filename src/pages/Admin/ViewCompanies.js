import React, { useState, useEffect } from 'react';

function ViewCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // TODO: Fetch all companies from the backend (e.g., GET /api/admin/companies)
    const dummyCompanies = [
      { CompanyID: 1, CompanyName: 'Tech Corp', Email: 'contact@tech.com', IsVerified: true },
      { CompanyID: 2, CompanyName: 'Innovate LLC', Email: 'hr@innovate.com', IsVerified: false },
    ];
    setCompanies(dummyCompanies);
  }, []);

  return (
    <div>
      <h2>All Companies</h2>
      {companies.map(company => (
        <div key={company.CompanyID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{company.CompanyName}</h3>
          <p>Email: {company.Email}</p>
          <p>Status: {company.IsVerified ? 'Verified' : 'Not Verified'}</p>
        </div>
      ))}
    </div>
  );
}

export default ViewCompanies;