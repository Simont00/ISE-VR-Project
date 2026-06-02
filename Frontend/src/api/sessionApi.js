import api from "../services/api";

/* =========================
   SESSION API (AXIOS VERSION)
========================= */

// ▶️ Start session
export const startSession = (userId) =>
  api.post("/api/session/start", { user_id: userId });

// ⏹️ End session
export const endSession = (sessionId) =>
  api.post(`/api/session/end/${sessionId}`);

// 📜 User sessions
export const getUserSessions = (userId) =>
  api.get(`/api/session/user/${userId}`).then(res => res.data);

// 🟢 Active session
export const getActiveSession = (userId) =>
  api
    .get(`/api/session/active/${userId}`)
    .then(res => res.data)
    .catch(() => null);