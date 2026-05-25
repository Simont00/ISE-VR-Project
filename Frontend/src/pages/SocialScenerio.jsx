import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

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

  const questionData = questionBank[currentQ];

  // ================= SHUFFLE OPTIONS =================
  useEffect(() => {
    setOptions(shuffle(questionData.options));
  }, [currentQ]);

  // ================= VOICE =================
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
    if (!voice || sessionComplete) return;
    speak(questionData.question);
  }, [currentQ, voice]);

  // ================= CLICK =================
  const handleOptionClick = (opt, index) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(index);

    if (opt.isCorrect) {
      setMessage("Correct Answer ✅");
      speak("Correct answer");

      setTimeout(() => {
        setSelectedIndex(null);

        if (currentQ < questionBank.length - 1) {
          setCurrentQ((p) => p + 1);
        } else {
          setSessionComplete(true);
          speak("Session completed");
        }
      }, 900);
    } else {
      setMessage("Wrong Answer ❌ Try again");
      speak("Wrong answer try again");

      setTimeout(() => {
        setSelectedIndex(null);
      }, 900);
    }
  };

  // ================= RESTART (FIXED + CLASSIC LOOK) =================
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

    if (isSel && opt.isCorrect) return styles.green;
    if (isSel && !opt.isCorrect) return styles.red;
    if (isHover) return styles.hover;
    return styles.normal;
  };

  const progress = ((currentQ + 1) / questionBank.length) * 100;

  // ================= SESSION COMPLETE =================
  if (sessionComplete) {
    return (
      <div style={styles.wrapper}>
        <Confetti />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={styles.completeCard}
        >
          <div style={{ fontSize: 60 }}>🎉</div>

          <h1>Session Completed</h1>
          <p>You completed Social Scenario Practice</p>

          <div style={{ fontSize: 26, margin: "10px 0" }}>⭐⭐⭐⭐⭐</div>

          {/* CLASSIC RESTART BUTTON */}
          <button onClick={handleRestart} style={styles.restartBtn}>
            🔄 Restart Practice
          </button>
        </motion.div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div style={styles.wrapper}>
      <div style={styles.bg} />

      <img src={animeLeft} style={styles.left} />
      <img src={animeRight} style={styles.right} />

      <motion.div style={styles.card} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <div style={styles.header}>
          <img src={teacher} style={styles.teacher} />
          <div>
            <h3>Social Scenerio</h3>
            <p>{message}</p>
          </div>
        </div>

        <div style={styles.bar}>
          <div style={{ ...styles.fill, width: `${progress}%` }} />
        </div>

        <h2 style={{ textAlign: "center" }}>{questionData.question}</h2>

        <div style={styles.grid}>
          {options.map((opt, i) => (
            <div
              key={i}
              style={getStyle(opt, i)}
              onClick={() => handleOptionClick(opt, i)}
              onMouseEnter={() => setHoveredIndex(i)}
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

// ================= PREMIUM STYLES =================
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#c7d2fe,#fbcfe8,#ddd6fe)",
    position: "relative",
  },

  bg: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgPattern})`,
    opacity: 0.15,
  },

  card: {
    width: "760px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(22px)",
    padding: 28,
    borderRadius: 24,
    zIndex: 2,
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },

  header: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  teacher: { width: 52 },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 20,
  },

  bar: {
    height: 8,
    background: "#e5e7eb",
    borderRadius: 20,
    margin: "12px 0",
  },

  fill: {
    height: "100%",
    background: "linear-gradient(to right,#6366f1,#ec4899)",
    borderRadius: 20,
  },

  normal: {
    padding: 16,
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "0.2s",
  },

  hover: {
    padding: 16,
    background: "#eff6ff",
    borderRadius: 14,
    border: "1px solid #60a5fa",
    color: "#1d4ed8",
    transform: "scale(1.03)",
    cursor: "pointer",
  },

  green: {
    padding: 16,
    background: "#dcfce7",
    borderRadius: 14,
    border: "2px solid #22c55e",
    color: "#166534",
    fontWeight: "600",
  },

  red: {
    padding: 16,
    background: "#fee2e2",
    borderRadius: 14,
    border: "2px solid #ef4444",
    color: "#991b1b",
    fontWeight: "600",
  },

  completeCard: {
    background: "rgba(255,255,255,0.95)",
    padding: 45,
    borderRadius: 26,
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },

  restartBtn: {
    marginTop: 15,
    padding: "12px 22px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(to right,#4f46e5,#ec4899)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  left: { position: "absolute", left: 0, width: 180 },
  right: { position: "absolute", right: 0, width: 180 },
};

export default SocialScenerio;