import axios from "axios";

/* =========================
   BASE CONFIG (ENV BASED)
========================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   AUTO TOKEN ATTACH
========================= */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ise_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   HANDLE UNAUTHORIZED
========================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ise_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* =========================
   AUTH APIs
========================= */

export const registerUser = (data) =>
  api.post("/api/auth/register", data);

export const loginUser = (data) =>
  api.post("/api/auth/login", data);

export const getMe = () =>
  api.get("/api/auth/profile");

export const updateMe = (data) =>
  api.put("/api/auth/update", data);

export const changePassword = (data) =>
  api.put("/api/auth/change-password", data);

/* =========================
   SESSIONS (CLEANED)
========================= */

export const getSessions = () =>
  api.get("/api/session/user"); // optional fallback

export const startSession = (userId) =>
  api.post("/api/session/start", { user_id: userId });

export const endSession = (sessionId) =>
  api.post(`/api/session/end/${sessionId}`);

/* =========================
   EMOTIONS
========================= */

export const logEmotion = (data) =>
  api.post("/api/emotions", data);

export const getEmotions = (sessionId) =>
  api.get(`/api/emotions?session=${sessionId}`);

/* =========================
   REPORTS
========================= */

export const getReports = () =>
  api.get("/api/reports");

export default api;