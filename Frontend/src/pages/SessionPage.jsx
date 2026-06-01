import { useState, useEffect } from "react";
import ActiveSessionCard from "../components/ActiveSessionCard";
import SessionControls from "../components/SessionControls";
import SessionTable from "../components/SessionTable";
import {
  startSession,
  endSession,
  getUserSessions,
  getActiveSession,
} from "../api/sessionApi";
import "./SessionPage.css";

const TEMP_USER_ID = 1;

const SessionPage = () => {
  const [sessions, setSessions]           = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [pageLoading, setPageLoading]     = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setPageLoading(true);
    setError("");
    try {
      const [active, history] = await Promise.all([
        getActiveSession(TEMP_USER_ID),
        getUserSessions(TEMP_USER_ID),
      ]);
      setActiveSession(active);
      setSessions(history || []);
    } catch (err) {
      setSessions([]);
      setActiveSession(null);
    } finally {
      setPageLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const newSession = await startSession(TEMP_USER_ID);
      setActiveSession(newSession);
      setSessions((prev) => [newSession, ...prev]);
    } catch (err) {
      setError("Failed to start session. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async (sessionId) => {
    setLoading(true);
    setError("");
    try {
      const updated = await endSession(sessionId);
      setActiveSession(null);
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
    } catch (err) {
      setError("Failed to end session. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="session-page loading-state">
        <div className="spinner" />
        <p>Loading sessions...</p>
      </div>
    );
  }

  const totalSessions = sessions.length;
  const endedSessions = sessions.filter((s) => !s.is_active);

  return (
    <div className="session-page">

      <div className="page-header">
        <div>
          <h1 className="page-title">Session Dashboard</h1>
          <p className="page-sub">Real-time VR Session Monitoring</p>
        </div>
        <button className="btn-refresh" onClick={loadData}>↺ Refresh</button>
      </div>

      {error && <div className="error-banner">⚠ {error}</div>}

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Sessions</span>
          <span className="stat-value">{totalSessions}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{endedSessions.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Now</span>
          <span className={`stat-value ${activeSession ? "active-count" : ""}`}>
            {activeSession ? "1" : "0"}
          </span>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">Current Session</h2>
        <ActiveSessionCard session={activeSession} onEnd={handleEnd} loading={loading} />
      </section>

      <SessionControls onStart={handleStart} onEnd={handleEnd} activeSession={activeSession} loading={loading} />

      <section className="section">
        <h2 className="section-title">Session History</h2>
        <SessionTable sessions={sessions} />
      </section>
    </div>
  );
};

export default SessionPage;
