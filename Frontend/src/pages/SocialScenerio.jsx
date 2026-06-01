import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

// Static Infrastructure Asset Imports
import animeLeft from "../assets/anime-left.png";
import animeRight from "../assets/anime-right.png";
import bgPattern from "../assets/bg-pattern.png";
import teacher from "../assets/teacher.png";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SocialScenerio = () => {
  const questionBank = [
    {
      question: "Your friend drops a pencil. What should you do?",
      options: [
        { text: "Help your friend", isCorrect: true },
        { text: "Ignore it", isCorrect: false },
        { text: "Laugh", isCorrect: false },
      ],
    },
    {
      question: "Teacher enters the classroom. What should you do?",
      options: [
        { text: "Say Good Morning", isCorrect: true },
        { text: "Ignore teacher", isCorrect: false },
        { text: "Turn away", isCorrect: false },
      ],
    },
    {
      question: "In group activity you should:",
      options: [
        { text: "Cooperate", isCorrect: true },
        { text: "Fight", isCorrect: false },
        { text: "Do nothing", isCorrect: false },
      ],
    },
    {
      question: "Your friend wants your toy. You:",
      options: [
        { text: "Share it", isCorrect: true },
        { text: "Hide it", isCorrect: false },
        { text: "Shout", isCorrect: false },
      ],
    },
    {
      question: "You hurt someone by mistake. You say:",
      options: [
        { text: "Sorry", isCorrect: true },
        { text: "Run away", isCorrect: false },
        { text: "Ignore", isCorrect: false },
      ],
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [message, setMessage] = useState("Read carefully before answering");
  const [sessionComplete, setSessionComplete] = useState(false);
  const [voice, setVoice] = useState(null);
  const [options, setOptions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const questionData = questionBank[currentQ];

  // Screen resize checker for layout safety
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= SHUFFLE OPTIONS =================
  useEffect(() => {
    if (questionData) {
      setOptions(shuffle(questionData.options));
    }
  }, [currentQ]);

  // ================= VOICE ENGINE =================
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const female =
        voices.find((v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha")
        ) || voices[0];
      setVoice(female);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (!voice) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.rate = 0.85;
    utter.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (!voice || sessionComplete || !questionData) return;
    speak(questionData.question);
  }, [currentQ, voice, sessionComplete]);

  // ================= CLICK HANDLER =================
  const handleOptionClick = (opt, index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);

    if (opt.isCorrect) {
      setMessage("Correct Answer ✅");
      speak("Correct answer");

      setTimeout(() => {
        setSelectedIndex(null);
        setHoveredIndex(null);
        if (currentQ < questionBank.length - 1) {
          setCurrentQ((p) => p + 1);
          setMessage("Read carefully before answering");
        } else {
          setSessionComplete(true);
          speak("Session completed");
        }
      }, 1100);
    } else {
      setMessage("Wrong Answer ❌ Try again");
      speak("Wrong answer try again");

      setTimeout(() => {
        setSelectedIndex(null);
        setHoveredIndex(null);
        setMessage("Read carefully before answering");
      }, 1100);
    }
  };

  // ================= RESTART EVALUATION =================
  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedIndex(null);
    setHoveredIndex(null);
    setMessage("Read carefully before answering");
    setSessionComplete(false);
    speak("Let's start again");
  };

  const getStyle = (opt, i) => {
    const isSel = selectedIndex === i;
    const isHover = hoveredIndex === i && selectedIndex === null;

    if (isSel && opt.isCorrect) return { ...styles.baseOption, ...styles.green };
    if (isSel && !opt.isCorrect) return { ...styles.baseOption, ...styles.red };
    if (isHover) return { ...styles.baseOption, ...styles.hover };
    return { ...styles.baseOption, ...styles.normal };
  };

  const progress = ((currentQ + 1) / questionBank.length) * 100;

  // ================= UI TERMINATION BLOCK =================
  if (sessionComplete) {
    return (
      <div style={styles.wrapper}>
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />
        <div style={styles.bg} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={styles.completeCard}
        >
          <div style={{ fontSize: 60, marginBottom: 10 }}>🎉</div>
          <h1 style={{ fontSize: "24px", color: "#1e1b4b", fontWeight: "700" }}>Session Completed</h1>
          <p style={{ color: "#4b5563", margin: "8px 0 16px 0" }}>You completed Social Scenario Practice successfully!</p>
          <div style={{ fontSize: 26, margin: "10px 0 20px 0" }}>⭐⭐⭐⭐⭐</div>
          <button onClick={handleRestart} style={styles.restartBtn}>
            🔄 Restart Practice
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bg} />

      {!isMobile && <img src={animeLeft} style={styles.left} alt="" />}
      {!isMobile && <img src={animeRight} style={styles.right} alt="" />}

      <motion.div style={{ ...styles.card, width: isMobile ? "92%" : "720px" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        {/* HEADER SYSTEM */}
        <div style={styles.header}>
          <img src={teacher} style={styles.teacher} alt="" />
          <div>
            <h3 style={{ margin: 0, fontWeight: "700", color: "#1e1b4b", fontSize: "16px" }}>Social Cognitive Scenario</h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#4f46e5", fontWeight: "500" }}>{message}</p>
          </div>
        </div>

        {/* METRIC MATRIX PROGRESS */}
        <div style={styles.bar}>
          <div style={{ ...styles.fill, width: `${progress}%` }} />
        </div>

        <h2 style={{ textAlign: "center", fontSize: "20px", color: "#111827", margin: "24px 0", fontWeight: "600" }}>
          {questionData?.question}
        </h2>

        {/* INTERACTIVE OPTIONS GRID */}
        <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          {options.map((opt, i) => (
            <div
              key={i}
              style={getStyle(opt, i)}
              onClick={() => handleOptionClick(opt, i)}
              onMouseEnter={() => selectedIndex === null && setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {opt.text}
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};

// ================= PREMIUM STYLE MATRIX =================
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #c7d2fe, #fbcfe8, #ddd6fe)",
    position: "relative",
    overflow: "hidden",
    padding: "16px",
  },
  bg: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgPattern})`,
    backgroundRepeat: "repeat",
    opacity: 0.15,
    zIndex: 1,
  },
  card: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    padding: "28px",
    borderRadius: "24px",
    zIndex: 2,
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
  },
  header: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  teacher: { 
    width: "48px", 
    height: "48px", 
    borderRadius: "12px",
    objectFit: "cover" 
  },
  grid: {
    display: "grid",
    gap: "12px",
    marginTop: "20px",
  },
  bar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "20px",
    margin: "16px 0",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    background: "linear-gradient(to right, #6366f1, #ec4899)",
    borderRadius: "20px",
    transition: "width 0.3s ease",
  },
  baseOption: {
    padding: "16px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.15s ease",
    userSelect: "none",
  },
  normal: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#1f2937",
    cursor: "pointer",
  },
  hover: {
    background: "#eff6ff",
    border: "1px solid #60a5fa",
    color: "#1d4ed8",
    transform: "scale(1.02)",
    cursor: "pointer",
  },
  green: {
    background: "#dcfce7",
    border: "2px solid #22c55e",
    color: "#166534",
    fontWeight: "600",
    cursor: "default",
  },
  red: {
    background: "#fee2e2",
    border: "2px solid #ef4444",
    color: "#991b1b",
    fontWeight: "600",
    cursor: "default",
  },
  completeCard: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(16px)",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    maxWidth: "400px",
    width: "100%",
    zIndex: 5,
  },
  restartBtn: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(to right, #4f46e5, #ec4899)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
  },
  left: { position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "160px", zIndex: 2 },
  right: { position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "160px", zIndex: 2 },
};

export default SocialScenerio;