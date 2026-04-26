import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';

function RegisterPage() {
  const [formData, setFormData] = useState({});
  const [role, setRole] = useState('candidate'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // The backend endpoint will likely be /auth/register and take the role in the body
      const response = await apiClient.post('/auth/register', {
        ...formData,
        role,
      });

      // On successful registration, alert the user and redirect to the login page
      alert(response.data.message);
      navigate('/login');
    } catch (err) {
      console.error('Registration API Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <div onChange={(e) => setRole(e.target.value)}>
        <input type="radio" value="candidate" name="role" defaultChecked /> Candidate
        <input type="radio" value="company" name="role" /> Company
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        {role === 'candidate' ? (
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} />
        ) : (
          <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} />
        )}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        
        {role === 'candidate' && (
          <>
            <input type="text" name="phoneNumber" placeholder="Phone Number (Optional)" onChange={handleChange} />
            <input type="text" name="skills" placeholder="Skills (comma-separated, Optional)" onChange={handleChange} />
            {/* ResumeLink, CoverLetter, ExperienceYears can be added later in profile update */}
          </>
        )}

        {role === 'company' && (
          <>
            <input type="text" name="phoneNumber" placeholder="Phone Number (Optional)" onChange={handleChange} />
            <input type="text" name="industry" placeholder="Industry (Optional)" onChange={handleChange} />
            <input type="text" name="location" placeholder="Location (Optional)" onChange={handleChange} />
            <input type="text" name="website" placeholder="Website (Optional)" onChange={handleChange} />
            <textarea name="description" placeholder="Company Description (Optional)" onChange={handleChange}></textarea>
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default RegisterPage;