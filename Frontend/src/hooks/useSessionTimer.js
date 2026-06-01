// =============================================
//  useSessionTimer.js — Live timer hook
// =============================================
import { useState, useEffect, useRef } from "react";

const useSessionTimer = (isActive, startTime) => {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && startTime) {
      // startTime se abhi tak kitna time hua
      const startMs = new Date(startTime).getTime();
      setElapsed(Math.floor((Date.now() - startMs) / 1000));

      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startMs) / 1000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, startTime]);

  // seconds → "HH:MM:SS" format
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  return formatTime(elapsed);
};

export default useSessionTimer;
