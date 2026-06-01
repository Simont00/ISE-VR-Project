const SessionControls = ({ onStart, onEnd, activeSession, loading }) => {
  return (
    <div className="controls-bar">
      <button className="btn-start" onClick={onStart} disabled={!!activeSession || loading}>
        ▶ Start Session
      </button>
      <button className="btn-stop" onClick={() => activeSession && onEnd(activeSession.id)} disabled={!activeSession || loading}>
        ⏹ End Session
      </button>
    </div>
  );
};

export default SessionControls;
