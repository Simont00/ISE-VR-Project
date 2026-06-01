// =============================================
//  SessionTimer.jsx — Live running timer
// =============================================
import useSessionTimer from "../hooks/useSessionTimer";

const SessionTimer = ({ isActive, startTime }) => {
  const time = useSessionTimer(isActive, startTime);

  return (
    <div className="timer-display">
      <span className="timer-label">Duration</span>
      <span className="timer-value">{time}</span>
    </div>
  );
};

export default SessionTimer;
