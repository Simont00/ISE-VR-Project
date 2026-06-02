import SessionTimer from "./SessionTimer";

const ActiveSessionCard = ({ session, onEnd, loading }) => {
  if (!session) {
    return (
      <div className="no-session-card">
        <div className="no-session-icon">⏸</div>
        <p>No active session</p>
        <span>Press Start Session to begin a new session</span>
      </div>
    );
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="active-card">
      <div className="active-card-header">
        <div className="active-badge">
          <span className="pulse-dot" />
          Active Session
        </div>
        <button className="btn-end" onClick={() => onEnd(session.id)} disabled={loading}>
          {loading ? "Ending..." : "⏹ End Session"}
        </button>
      </div>
      <div className="active-card-body">
        <div className="info-item">
          <span className="info-label">Session ID</span>
          <span className="info-value">#{session.id}</span>
        </div>
        <div className="info-item">
          <span className="info-label">User ID</span>
          <span className="info-value">#{session.user_id}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Started At</span>
          <span className="info-value">{formatTime(session.start_time)}</span>
        </div>
        <div className="info-item timer-item">
          <SessionTimer isActive={true} startTime={session.start_time} />
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionCard;
