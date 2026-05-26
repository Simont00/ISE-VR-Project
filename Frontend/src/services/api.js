import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ise_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ise_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// AUTH — exact backend routes se match
export const registerUser     = (data) => api.post('/api/auth/register', data)
export const loginUser        = (data) => api.post('/api/auth/login', data)
export const getMe            = ()     => api.get('/api/auth/profile')   // ✅ /profile
export const updateMe         = (data) => api.put('/api/auth/update', data) // ✅ /update
export const changePassword   = (data) => api.put('/api/auth/change-password', data)

// SESSIONS
export const getSessions  = ()         => api.get('/api/sessions')
export const startSession = (data)     => api.post('/api/sessions/start', data)
export const endSession   = (id, data) => api.put(`/api/sessions/${id}/end`, data)

// EMOTIONS
export const logEmotion  = (data)      => api.post('/api/emotions', data)
export const getEmotions = (sessionId) => api.get(`/api/emotions?session=${sessionId}`)

// REPORTS
export const getReports = () => api.get('/api/reports')

export default api