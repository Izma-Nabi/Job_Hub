import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  // IMPORTANT: Replace this with your backend's actual URL and port
  baseURL: 'http://localhost:5000/api', // Ensure this matches the backend port
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
