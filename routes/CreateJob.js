import React, { useState } from 'react';
import apiClient from '../../api/axiosConfig';

function CreateJob() {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryRange: '',
    employmentType: 'Full-time',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await apiClient.post('/jobs', jobData);
      if (response.data.success) {
        setMessage(`Job created successfully with ID: ${response.data.id}`);
        // Optionally, clear the form
        setJobData({ title: '', description: '', requirements: '', location: '', salaryRange: '', employmentType: 'Full-time' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create job. Please try again.';
      setMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Create a New Job Posting</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreateJob}>
        <input type="text" name="title" placeholder="Job Title" value={jobData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Job Description" value={jobData.description} onChange={handleChange} required></textarea>
        <textarea name="requirements" placeholder="Requirements" value={jobData.requirements} onChange={handleChange}></textarea>
        <input type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleChange} />
        <input type="text" name="salaryRange" placeholder="Salary Range" value={jobData.salaryRange} onChange={handleChange} />
        <select name="employmentType" value={jobData.employmentType} onChange={handleChange}>
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