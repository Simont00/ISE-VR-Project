import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

import animeLeft  from "../assets/anime-left.png";
import animeRight from "../assets/anime-right.png";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const speak = (text, soundOn) => {
  if (!soundOn || typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.88; utter.pitch = 1.2;
  const voices = speechSynthesis.getVoices();
  const female = voices.find(v => /samantha|zira|google uk.*female|female/i.test(v.name))
    || voices.find(v => v.lang === "en-US") || voices[0];
  if (female) utter.voice = female;
  speechSynthesis.speak(utter);
};

const QUESTIONS = [
  { question: "Your friend drops a pencil. What should you do?", options: [{ text: "Pick it up and help", isCorrect: true }, { text: "Ignore it", isCorrect: false }, { text: "Laugh at them", isCorrect: false }] },
  { question: "Teacher enters the classroom. What should you do?", options: [{ text: "Say Good Morning!", isCorrect: true }, { text: "Ignore the teacher", isCorrect: false }, { text: "Turn away", isCorrect: false }] },
  { question: "During a group activity you should:", options: [{ text: "Cooperate with everyone", isCorrect: true }, { text: "Work alone only", isCorrect: false }, { text: "Do nothing", isCorrect: false }] },
  { question: "Your friend wants to use your toy. You:", options: [{ text: "Share it happily", isCorrect: true }, { text: "Hide it away", isCorrect: false }, { text: "Shout at them", isCorrect: false }] },
  { question: "You accidentally hurt someone. You say:", options: [{ text: "I'm sorry, are you okay?", isCorrect: true }, { text: "Run away quickly", isCorrect: false }, { text: "Ignore them", isCorrect: false }] },
];

const SocialScenerio = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ]               = useState(0);
  const [selectedIndex, setSelectedIndex]     = useState(null);
  const [message, setMessage]                 = useState("Think carefully before answering.");
  const [soundOn, setSoundOn]                 = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [score, setScore]                     = useState(0);
  const [options, setOptions]                 = useState([]);

  const questionData = QUESTIONS[currentQ];
  const progress = (currentQ / QUESTIONS.length) * 100;

  useEffect(() => {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.onvoiceschanged = () => {};
  }, []);

  useEffect(() => {
    if (questionData) setOptions(shuffle(questionData.options));
  }, [currentQ]);

  useEffect(() => {
    if (sessionComplete || !questionData) return;
    setTimeout(() => speak(questionData.question, soundOn), 300);
  }, [currentQ, sessionComplete]);

  const handleOptionClick = (opt, index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);

    // ✅ FIX: opt.isCorrect directly
    const isCorrect = opt.isCorrect === true;

    if (isCorrect) {
      setScore(s => s + 1);
      setMessage("Correct! That's very kind ✅");
      speak("Correct! That's very kind", soundOn);
      setTimeout(() => {
        setSelectedIndex(null);
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ(p => p + 1);
          setMessage("Think carefully before answering.");
        } else {
          setSessionComplete(true);
          speak("Session complete! You did amazing!", soundOn);
        }
      }, 1200);
    } else {
      setMessage("Not quite right, try again ❌");
      speak("Not quite right, try again", soundOn);
      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("Think carefully before answering.");
      }, 1200);
    }
  };

  const getOptionStyle = (opt, index) => {
    const base = { padding: "14px 18px", borderRadius: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s ease", userSelect: "none", border: "1px solid" };
    if (selectedIndex === index) {
      return opt.isCorrect
        ? { ...base, background: "rgba(46,196,182,0.15)", borderColor: "#2EC4B6", color: "#2EC4B6" }
        : { ...base, background: "rgba(232,72,85,0.15)", borderColor: "#E84855", color: "#E84855" };
    }
    return { ...base, background: "rgba(255,255,255,0.04)", borderColor: "#2A2456", color: "#C4C0D8" };
  };

  if (sessionComplete) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0B1E", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} colors={["#7B5EA7","#5B4FCF","#2EC4B6","#9B72CF"]} />
        <img src={animeLeft}  alt="" style={{ position: "absolute", left: 0,  bottom: 0, width: "220px", opacity: 0.5, zIndex: 1, pointerEvents: "none" }} />
        <img src={animeRight} alt="" style={{ position: "absolute", right: 0, bottom: 0, width: "220px", opacity: 0.5, zIndex: 1, pointerEvents: "none" }} />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: "#141226", border: "1px solid #2A2456", borderRadius: "24px", padding: "48px 40px", textAlign: "center", maxWidth: "420px", width: "100%", margin: "16px", zIndex: 2 }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🌟</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#E8E6F0", marginBottom: "8px" }}>Session Complete!</h1>
          <p style={{ color: "#8B87A8", marginBottom: "8px" }}>You scored <span style={{ color: "#9B72CF", fontWeight: "700" }}>{score}/{QUESTIONS.length}</span></p>
          <div style={{ fontSize: "28px", margin: "12px 0 24px" }}>{"⭐".repeat(Math.round((score / QUESTIONS.length) * 5))}</div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={() => { setCurrentQ(0); setSessionComplete(false); setScore(0); }}
              style={{ padding: "12px 24px", background: "linear-gradient(135deg, #7B5EA7, #5B4FCF)", color: "#fff", fontWeight: "600", borderRadius: "12px", border: "none", cursor: "pointer" }}>
              🔄 Restart
            </button>
            <button onClick={() => navigate("/scenarios")}
              style={{ padding: "12px 24px", background: "rgba(255,255,255,0.05)", color: "#8B87A8", fontWeight: "600", borderRadius: "12px", border: "1px solid #2A2456", cursor: "pointer" }}>
              ← Back
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1E", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>

      {/* ✅ Anime characters */}
      <img src={animeLeft}  alt="" style={{ position: "absolute", left: 0,  bottom: 0, width: "220px", zIndex: 1, pointerEvents: "none" }} />
      <img src={animeRight} alt="" style={{ position: "absolute", right: 0, bottom: 0, width: "220px", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "660px", position: "relative", zIndex: 2 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <button onClick={() => navigate("/scenarios")}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2A2456", borderRadius: "10px", padding: "8px 16px", color: "#8B87A8", cursor: "pointer", fontSize: "13px" }}>
            ← Scenarios
          </button>
          <div style={{ display: "flex", gap: "10px" }}>
            <span style={{ fontSize: "11px", padding: "4px 12px", borderRadius: "999px", background: "rgba(255,159,28,0.1)", color: "#FF9F1C", border: "1px solid rgba(255,159,28,0.3)" }}>Intermediate</span>
            <button onClick={() => setSoundOn(s => !s)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2A2456", borderRadius: "10px", padding: "6px 14px", color: "#8B87A8", cursor: "pointer", fontSize: "13px" }}>
              {soundOn ? "🔊 On" : "🔇 Off"}
            </button>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#141226", border: "1px solid #231E47", borderRadius: "20px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #FF9F1C, #7B5EA7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🤜</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#E8E6F0" }}>Social Scenarios</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#8B87A8" }}>{message}</p>
            </div>
            <div style={{ fontSize: "12px", color: "#8B87A8", flexShrink: 0 }}>{currentQ + 1} / {QUESTIONS.length}</div>
          </div>

          <div style={{ height: "6px", background: "#2A2456", borderRadius: "99px", marginBottom: "28px", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #FF9F1C, #7B5EA7)", width: `${progress}%`, transition: "width 0.3s ease" }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.h2 key={currentQ} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{ fontSize: "18px", fontWeight: "600", color: "#E8E6F0", textAlign: "center", marginBottom: "24px", lineHeight: "1.5" }}>
              {questionData?.question}
            </motion.h2>
          </AnimatePresence>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {options.map((opt, i) => (
              <div key={i} style={getOptionStyle(opt, i)} onClick={() => handleOptionClick(opt, i)}>{opt.text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialScenerio;
