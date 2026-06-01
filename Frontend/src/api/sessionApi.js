// =============================================
// sessionApi.js — FIXED VERSION
// =============================================

const BASE_URL = "http://127.0.0.1:5000/api"; // ✔ IMPORTANT FIX

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("ise_token") || ""}`,
});

// ▶️ Start session
export const startSession = async (userId) => {
  const response = await fetch(`${BASE_URL}/session/start`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) throw new Error("Session start failed");
  return response.json();
};

// ⏹️ End session
export const endSession = async (sessionId) => {
  const response = await fetch(`${BASE_URL}/session/end/${sessionId}`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Session end failed");
  return response.json();
};

// 📜 User sessions
export const getUserSessions = async (userId) => {
  const response = await fetch(`${BASE_URL}/session/user/${userId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch sessions");
  return response.json();
};

// 🟢 Active session
export const getActiveSession = async (userId) => {
  const response = await fetch(`${BASE_URL}/session/active/${userId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) return null;
  return response.json();
};