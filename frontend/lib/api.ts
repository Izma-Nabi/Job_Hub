import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (role: string, data: any) =>
    api.post('/auth/register', { ...data, role }),
  login: (role: string, data: any) =>
    api.post('/auth/login', { ...data, role }),
};

export const jobsApi = {
  getAllJobs: () => api.get('/jobs'),
  getJobById: (id: number) => api.get(`/jobs/${id}`),
  getJobsByCompany: (companyId: number) => api.get(`/jobs/company/${companyId}`),
  createJob: (data: any) => api.post('/jobs', data),
  updateJob: (id: number, data: any) => api.put(`/jobs/${id}`, data),
  deleteJob: (id: number) => api.delete(`/jobs/${id}`),
  applyJob: (jobId: number, data: any) => api.post(`/jobs/${jobId}/apply`, data),
  withdrawApplication: (jobId: number) => api.delete(`/jobs/${jobId}/application`),
  getApplications: (jobId: number) => api.get(`/jobs/${jobId}/applications`),
  getInterviews: (jobId: number) => api.get(`/jobs/${jobId}/interviews`),
};

export const candidateApi = {
  getProfile: () => api.get('/candidate/me'),
  updateProfile: (data: any) => api.put('/candidate/me', data),
  getApplications: () => api.get('/applications'),
  getApplication: (id: number) => api.get(`/applications/${id}`),
};

export default api;
