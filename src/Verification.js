import React, { useState, useEffect } from 'react';

function Verification() {
  const [unverified, setUnverified] = useState([]);

  useEffect(() => {
    // TODO: Fetch all unverified companies from the backend
    // (e.g., GET /api/admin/companies?verified=false)
    const dummyUnverified = [
      { CompanyID: 2, CompanyName: 'Innovate LLC', Email: 'hr@innovate.com' },
    ];
    setUnverified(dummyUnverified);
  }, []);

  const verifyCompany = (companyId) => {
    // TODO: Call the backend API to verify the company
    // (e.g., PUT /api/admin/companies/:companyId/verify)
    console.log(`Verifying company ${companyId}`);
  };

  return (
    <div>
      <h2>Company Verification Queue</h2>
      {unverified.map(company => (
        <div key={company.CompanyID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{company.CompanyName}</h3>
          <button onClick={() => verifyCompany(company.CompanyID)}>Verify Company</button>
        </div>
      ))}
    </div>
  );
}

export default Verification;