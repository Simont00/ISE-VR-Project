import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

import animeLeft from "../assets/anime-left.png";
import animeRight from "../assets/anime-right.png";
import bgPattern from "../assets/bg-pattern.png";
import teacher from "../assets/teacher.png";

const GreetingScenerio = () => {
  const questionBank = [
    {
      question: "What should you say when you meet someone?",
      options: [
        { text: "Ignore them", isCorrect: false },
        { text: "Say Hello", isCorrect: true },
        { text: "Turn away", isCorrect: false },
      ],
    },
    {
      question: "Which is a polite greeting?",
      options: [
        { text: "Hi", isCorrect: true },
        { text: "Go away", isCorrect: false },
        { text: "Leave me", isCorrect: false },
      ],
    },
    {
      question: "What is a formal greeting?",
      options: [
        { text: "Good Morning Sir/Ma'am", isCorrect: true },
        { text: "Yo", isCorrect: false },
        { text: "Nothing", isCorrect: false },
      ],
    },
    {
      question: "How do you greet a friend casually?",
      options: [
        { text: "Hey! What's up?", isCorrect: true },
        { text: "I don't talk", isCorrect: false },
        { text: "Walk away", isCorrect: false },
      ],
    },
    {
      question: "What do you say when leaving?",
      options: [
        { text: "Goodbye!", isCorrect: true },
        { text: "Whatever", isCorrect: false },
        { text: "Nothing", isCorrect: false },
      ],
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null); // index number store karo, object nahi
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [message, setMessage] = useState("Read carefully before answering.");
  const [soundOn, setSoundOn] = useState(true);
  const [voice, setVoice] = useState(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [restarting, setRestarting] = useState(false);

  const questionData = questionBank[currentQ];

  // ---------------- VOICE SYSTEM ----------------
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const female =
        voices.find((v) => v.name.toLowerCase().includes("female")) ||
        voices.find((v) => v.name.toLowerCase().includes("zira")) ||
        voices.find((v) => v.name.toLowerCase().includes("samantha")) ||
        voices[0];
      setVoice(female);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (!soundOn || !voice) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.rate = 0.75;
    utter.pitch = 1.2;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (!voice || sessionComplete) return;
    speak(questionData.question);
  }, [currentQ, voice, sessionComplete]);

  // ---------------- OPTION CLICK ----------------
  const handleOptionClick = (opt, index) => {
    if (selectedIndex !== null) return; // already answered

    setSelectedIndex(index);
    setHoveredIndex(null);

    if (opt.isCorrect) {
      setMessage("Correct answer ✅");
      speak("Correct answer");

      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("Read carefully before answering.");
        if (currentQ < questionBank.length - 1) {
          setCurrentQ((prev) => prev + 1);
        } else {
          setSessionComplete(true);
          setMessage("Session completed 🎯");
          speak("Session completed");
        }
      }, 1200);
    } else {
      setMessage("Wrong answer, try again ❌");
      speak("Wrong answer, try again");

      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("Read carefully before answering.");
        // same question repeat — currentQ nahi badla
      }, 1200);
    }
  };

  // ---------------- OPTION STYLE (pure inline, no Tailwind) ----------------
  const getOptionStyle = (opt, index) => {
    const isSelected = selectedIndex === index;
    const isHovered = hoveredIndex === index && selectedIndex === null;

    if (isSelected && opt.isCorrect) {
      return {
        padding: "16px",
        borderRadius: "12px",
        border: "2px solid #16a34a",
        background: "#dcfce7",
        color: "#15803d",
        fontWeight: "600",
        fontSize: "15px",
        cursor: "default",
        transition: "all 0.15s ease",
        userSelect: "none",
      };
    }

    if (isSelected && !opt.isCorrect) {
      return {
        padding: "16px",
        borderRadius: "12px",
        border: "2px solid #dc2626",
        background: "#fee2e2",
        color: "#b91c1c",
        fontWeight: "600",
        fontSize: "15px",
        cursor: "default",
        transition: "all 0.15s ease",
        userSelect: "none",
      };
    }

    if (isHovered) {
  return {
    padding: "16px",
    borderRadius: "12px",
    border: "1.5px solid #60a5fa",
    background: "#dbeafe",
    color: "",
    fontWeight: "500",
    fontSize: "15px",
    cursor: "pointer",
    transform: "scale(1.02)",
    transition: "all 0.15s ease",
    userSelect: "none",
  };
}

    // default normal state
    return {
      padding: "16px",
      borderRadius: "12px",
      border: "1.5px solid #e5e7eb",
      background: "#ffffff",
      color: "#1f2937",
      fontWeight: "500",
      fontSize: "15px",
      cursor: selectedIndex !== null ? "default" : "pointer",
      transition: "all 0.15s ease",
      userSelect: "none",
    };
  };

  // ---------------- RESTART ----------------
  const handleRestart = () => {
    setRestarting(true);
    setTimeout(() => {
      setCurrentQ(0);
      setSelectedIndex(null);
      setHoveredIndex(null);
      setMessage("Read carefully before answering.");
      setSessionComplete(false);
      setRestarting(false);
    }, 500);
  };

  const progress = ((currentQ + 1) / questionBank.length) * 100;

  // ---------------- SESSION COMPLETE UI ----------------
  if (sessionComplete) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #bfdbfe, #e9d5ff, #fbcfe8)",
        }}
      >
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage: `url(${bgPattern})`,
            backgroundRepeat: "repeat",
          }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            padding: "32px",
            textAlign: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>
            Session Complete!
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            Great job! You completed all the greeting questions.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ fontSize: "28px" }}>⭐</span>
            ))}
          </div>
          <button
            onClick={handleRestart}
            disabled={restarting}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(to right, #3b82f6, #a855f7)",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            {restarting ? "Restarting..." : "🔄 Restart Session"}
          </button>
        </motion.div>
      </div>
    );
  }

  // ---------------- MAIN QUIZ UI ----------------
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #bfdbfe, #e9d5ff, #fbcfe8)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          backgroundImage: `url(${bgPattern})`,
          backgroundRepeat: "repeat",
        }}
      />

      <img
        src={animeLeft}
        alt=""
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "200px",
          display: window.innerWidth < 768 ? "none" : "block",
        }}
      />
      <img
        src={animeRight}
        alt=""
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "200px",
          display: window.innerWidth < 768 ? "none" : "block",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          padding: "24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={teacher} alt="" style={{ width: "48px", height: "48px", borderRadius: "12px" }} />
            <div>
              <p style={{ fontWeight: "700", fontSize: "15px", margin: 0, color: "#111827" }}>Learning Assistant</p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{message}</p>
            </div>
          </div>
          <button
            onClick={() => setSoundOn(!soundOn)}
            style={{
              padding: "6px 12px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            {soundOn ? "🔊 On" : "🔇 Off"}
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "99px" }}>
            <div
              style={{
                height: "8px",
                borderRadius: "99px",
                background: "linear-gradient(to right, #3b82f6, #a855f7)",
                width: `${progress}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* QUESTION */}
        <h1 style={{ fontSize: "20px", fontWeight: "600", textAlign: "center", marginBottom: "24px", color: "#111827" }}>
          {questionData.question}
        </h1>

        {/* OPTIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {questionData.options.map((opt, i) => (
            <div
              key={i}
              style={getOptionStyle(opt, i)}
              onClick={() => handleOptionClick(opt, i)}
              onMouseEnter={() => selectedIndex === null && setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {opt.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GreetingScenerio;