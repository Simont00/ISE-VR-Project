import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

// Assets Import
import animeLeft from "../assets/anime-left.png";
import animeRight from "../assets/anime-right.png";
import bgPattern from "../assets/bg-pattern.png";
import teacher from "../assets/teacher.png";

// Utils & Data Centralized Layer
import { questionBank } from "../data/questions";
import { calculateProgress, validateAnswer } from "../utils/learningEngine";
import { getFemaleVoice, speakText } from "../utils/voice";

const GreetingScenerio = () => {
  // Filter only greeting types from the central data store
  const greetingQuestions = questionBank.filter(
    (q) => q.category === "greeting" || !q.category || q.id <= 5
  );

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [message, setMessage] = useState("Read carefully before answering.");
  const [soundOn, setSoundOn] = useState(true);
  const [voice, setVoice] = useState(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [restarting, setRestarting] = useState(false);

  const questionData = greetingQuestions[currentQ];

  // Voice Engine Sync
  useEffect(() => {
    const initVoice = () => {
      const femaleVoice = getFemaleVoice();
      setVoice(femaleVoice);
    };
    initVoice();
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.onvoiceschanged = initVoice;
    }
  }, []);

  // Speak question when active index shifts
  useEffect(() => {
    if (!voice || sessionComplete || !questionData) return;
    speakText(questionData.question, voice, soundOn);
  }, [currentQ, voice, sessionComplete]);

  const handleOptionClick = (opt, index) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(index);
    setHoveredIndex(null);

    const isCorrect = validateAnswer(opt);

    if (isCorrect) {
      setMessage("Correct answer ✅");
      speakText("Correct answer", voice, soundOn);

      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("Read carefully before answering.");
        if (currentQ < greetingQuestions.length - 1) {
          setCurrentQ((prev) => prev + 1);
        } else {
          setSessionComplete(true);
          setMessage("Session completed 🎯");
          speakText("Session completed", voice, soundOn);
        }
      }, 1200);
    } else {
      setMessage("Wrong answer, try again ❌");
      speakText("Wrong answer, try again", voice, soundOn);

      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("Read carefully before answering.");
      }, 1200);
    }
  };

  const getOptionStyle = (opt, index) => {
    const isSelected = selectedIndex === index;
    const isHovered = hoveredIndex === index && selectedIndex === null;

    if (isSelected && opt.isCorrect) {
      return {
        padding: "16px", borderRadius: "12px", border: "2px solid #16a34a",
        background: "#dcfce7", color: "#15803d", fontWeight: "600", fontSize: "15px",
        cursor: "default", transition: "all 0.15s ease", userSelect: "none",
      };
    }
    if (isSelected && !opt.isCorrect) {
      return {
        padding: "16px", borderRadius: "12px", border: "2px solid #dc2626",
        background: "#fee2e2", color: "#b91c1c", fontWeight: "600", fontSize: "15px",
        cursor: "default", transition: "all 0.15s ease", userSelect: "none",
      };
    }
    if (isHovered) {
      return {
        padding: "16px", borderRadius: "12px", border: "1.5px solid #60a5fa",
        background: "#dbeafe", fontWeight: "500", fontSize: "15px",
        cursor: "pointer", transform: "scale(1.02)", transition: "all 0.15s ease", userSelect: "none",
      };
    }
    return {
      padding: "16px", borderRadius: "12px", border: "1.5px solid #e5e7eb",
      background: "#ffffff", color: "#1f2937", fontWeight: "500", fontSize: "15px",
      cursor: selectedIndex !== null ? "default" : "pointer", transition: "all 0.15s ease", userSelect: "none",
    };
  };

  const progress = calculateProgress(currentQ, greetingQuestions.length);

  if (sessionComplete) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #bfdbfe, #e9d5ff, #fbcfe8)" }}>
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: `url(${bgPattern})`, backgroundRepeat: "repeat" }} />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "32px", textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>Session Complete!</h1>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>Great job! You completed all the greeting questions successfully.</p>
          <button onClick={() => { setRestarting(true); setTimeout(() => { setCurrentQ(0); setSessionComplete(false); setRestarting(false); }, 500); }} disabled={restarting} style={{ padding: "12px 24px", background: "linear-gradient(to right, #3b82f6, #a855f7)", color: "#fff", fontWeight: "600", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "15px" }}>
            {restarting ? "Restarting..." : "🔄 Restart Session"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #bfdbfe, #e9d5ff, #fbcfe8)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: `url(${bgPattern})`, backgroundRepeat: "repeat" }} />
      <img src={animeLeft} alt="" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "200px", display: window.innerWidth < 768 ? "none" : "block" }} />
      <img src={animeRight} alt="" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "200px", display: window.innerWidth < 768 ? "none" : "block" }} />

      <div style={{ width: "100%", maxWidth: "720px", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", padding: "24px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={teacher} alt="" style={{ width: "48px", height: "48px", borderRadius: "12px" }} />
            <div>
              <p style={{ fontWeight: "700", fontSize: "15px", margin: 0, color: "#111827" }}>Learning Assistant</p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{message}</p>
            </div>
          </div>
          <button onClick={() => setSoundOn(!soundOn)} style={{ padding: "6px 12px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
            {soundOn ? "🔊 On" : "🔇 Off"}
          </button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "99px" }}>
            <div style={{ height: "8px", borderRadius: "99px", background: "linear-gradient(to right, #3b82f6, #a855f7)", width: `${progress}%`, transition: "width 0.3s ease" }} />
          </div>
        </div>

        <h1 style={{ fontSize: "20px", fontWeight: "600", textAlign: "center", marginBottom: "24px", color: "#111827" }}>
          {questionData?.question}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {questionData?.options.map((opt, i) => (
            <div key={i} style={getOptionStyle(opt, i)} onClick={() => handleOptionClick(opt, i)} onMouseEnter={() => selectedIndex === null && setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {opt.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GreetingScenerio;