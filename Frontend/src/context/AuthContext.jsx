import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function logout() {
    localStorage.removeItem("ise_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  function saveSession(token, userData) {
    localStorage.setItem("ise_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }

  useEffect(() => {
    const token = localStorage.getItem("ise_token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      api
        .get("/api/profile")
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function register(name, email, password) {
    const res = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

    saveSession(res.data.token, res.data.user);
    return res.data.user;
  }

  async function login(email, password) {
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });

    saveSession(res.data.token, res.data.user);
    return res.data.user;
  }

  async function updateProfile(data) {
    const res = await api.put("/api/auth/update", data);
    setUser(res.data.user);
    return res.data.user;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}