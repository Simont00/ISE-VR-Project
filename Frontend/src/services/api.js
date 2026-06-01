<<<<<<< HEAD
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

=======
import axios from 'axios';

// Codespaces ka 5000 port wala exact URL bina kisi aakhiri slash ke
const api = axios.create({
  baseURL: 'https://bug-free-space-chainsaw-97v4g5grwv9gfxxxw-5000.app.github.dev',
  timeout: 10000,
  headers: { 
    'Content-Type': 'application/json' 
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ise_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ise_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ AUTH — Ab exact backend endpoints (/api/register aur /api/login) par hit karega
export const registerUser     = (data) => api.post('/api/register', data);
export const loginUser        = (data) => api.post('/api/login', data);
export const getMe            = ()     => api.get('/api/profile');   
export const updateMe         = (data) => api.put('/api/update', data); 
export const changePassword   = (data) => api.put('/api/change-password', data);
export const getUserProfile = () => api.get('/profile');
// Taaki ye perfect hit maare: /api/profile par!
// SESSIONS
export const getSessions  = ()         => api.get('/api/sessions');
export const startSession = (data)     => api.post('/api/sessions/start', data);
export const endSession   = (id, data) => api.put(`/api/sessions/${id}/end`, data);

// EMOTIONS
export const logEmotion  = (data)      => api.post('/api/emotions', data);
export const getEmotions = (sessionId) => api.get(`/api/emotions?session=${sessionId}`);

// REPORTS
export const getReports = () => api.get('/api/reports');

>>>>>>> origin/main
export default api;