import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig'; // Corrected path

function CandidateProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    skills: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch candidate data when the component mounts
    const fetchProfile = async () => {
      try {
        // The backend should have a protected route to get the current user's profile
        const response = await apiClient.get('/candidate/me');
        setProfile(response.data);
      } catch (error) {
        setMessage('Failed to fetch profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Send updated data to the backend
      await apiClient.put('/candidate/me', profile);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div>
      <h2>My Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
        <label>Email:</label>
        <input type="email" name="email" value={profile.email} readOnly />
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" value={profile.phoneNumber || ''} onChange={handleChange} />
        <label>Skills (comma-separated):</label>
        <input type="text" name="skills" value={profile.skills || ''} onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default CandidateProfile;