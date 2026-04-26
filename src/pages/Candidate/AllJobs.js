import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig'; // Corrected path
function AllJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get('/jobs');
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // Optionally set an error state to display to the user
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      // TODO: In a real app, you would get this from a form or user profile
      const response = await apiClient.post(`/jobs/${jobId}/apply`, {
        resumeLink: 'link-to-resume',
        coverLetter: 'optional-cover-letter',
      });

      if (response.status === 201) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      // Display the specific error message from the backend if it exists
      const errorMessage = error.response?.data?.message || 'Failed to apply for job. Please try again.';
      alert(errorMessage);
    }
  };
  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.map(job => (
        <div key={job.JobID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{job.Title} - {job.CompanyName}</h3>
          <p>Location: {job.Location}</p>
          <button onClick={() => handleApply(job.JobID)}>Apply</button>
        </div>
      ))}
    </div>
  );
}

export default AllJobs;