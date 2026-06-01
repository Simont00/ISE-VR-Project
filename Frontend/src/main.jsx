import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";  // ← ADD

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>   {/* ← WRAP */}
      <App />
    </AuthProvider>  {/* ← CLOSE */}
  </React.StrictMode>
);
