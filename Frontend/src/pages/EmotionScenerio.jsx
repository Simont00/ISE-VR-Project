import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

import animeLeft   from "../assets/anime-left.png";
import animeRight  from "../assets/anime-right.png";
import happyImg    from "../assets/emotions/happy.png";
import sadImg      from "../assets/emotions/sad.png";
import angryImg    from "../assets/emotions/angry.png";
import confusedImg from "../assets/emotions/confused.png";
import calmImg     from "../assets/emotions/calm.png";

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
  { question: "What emotion is represented here?",     image: happyImg,    options: [{ text: "Happy", isCorrect: true }, { text: "Sad", isCorrect: false }, { text: "Angry", isCorrect: false }, { text: "Calm", isCorrect: false }] },
  { question: "Can you identify this feeling?",        image: sadImg,      options: [{ text: "Confused", isCorrect: false }, { text: "Sad", isCorrect: true }, { text: "Happy", isCorrect: false }, { text: "Angry", isCorrect: false }] },
  { question: "Look closely — what emotion is this?",  image: angryImg,    options: [{ text: "Calm", isCorrect: false }, { text: "Happy", isCorrect: false }, { text: "Angry", isCorrect: true }, { text: "Sad", isCorrect: false }] },
  { question: "How is this person feeling right now?", image: confusedImg, options: [{ text: "Happy", isCorrect: false }, { text: "Confused", isCorrect: true }, { text: "Calm", isCorrect: false }, { text: "Angry", isCorrect: false }] },
  { question: "Identify this peaceful state:",         image: calmImg,     options: [{ text: "Angry", isCorrect: false }, { text: "Sad", isCorrect: false }, { text: "Calm", isCorrect: true }, { text: "Happy", isCorrect: false }] },
];

const EmotionScenerio = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ]               = useState(0);
  const [selectedIndex, setSelectedIndex]     = useState(null);
  const [message, setMessage]                 = useState("Observe the expression carefully 👀");
  const [soundOn, setSoundOn]                 = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [score, setScore]                     = useState(0);

  const questionData = QUESTIONS[currentQ];
  const progress = (currentQ / QUESTIONS.length) * 100;

  useEffect(() => {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.onvoiceschanged = () => {};
  }, []);

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
      setMessage("Correct! Great observation ✅");
      speak("Correct! Great observation", soundOn);
      setTimeout(() => {
        setSelectedIndex(null);
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ(p => p + 1);
          setMessage("Observe the expression carefully 👀");
        } else {
          setSessionComplete(true);
          speak("Session complete! Excellent work!", soundOn);
        }
      }, 1200);
    } else {
      setMessage("Not quite, look more closely ❌");
      speak("Not quite, look more closely", soundOn);
      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("Observe the expression carefully 👀");
      }, 1200);
    }
  };

  const getOptionStyle = (opt, index) => {
    const base = { padding: "12px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s ease", userSelect: "none", border: "1px solid", textAlign: "center" };
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
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🏆</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#E8E6F0", marginBottom: "8px" }}>Expression Sync Complete!</h1>
          <p style={{ color: "#8B87A8", marginBottom: "8px" }}>You scored <span style={{ color: "#9B72CF", fontWeight: "700" }}>{score}/{QUESTIONS.length}</span></p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
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

      <div style={{ width: "100%", maxWidth: "620px", position: "relative", zIndex: 2 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <button onClick={() => navigate("/scenarios")}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2A2456", borderRadius: "10px", padding: "8px 16px", color: "#8B87A8", cursor: "pointer", fontSize: "13px" }}>
            ← Scenarios
          </button>
          <div style={{ display: "flex", gap: "10px" }}>
            <span style={{ fontSize: "11px", padding: "4px 12px", borderRadius: "999px", background: "rgba(46,196,182,0.1)", color: "#2EC4B6", border: "1px solid rgba(46,196,182,0.3)" }}>Advanced</span>
            <button onClick={() => setSoundOn(s => !s)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2A2456", borderRadius: "10px", padding: "6px 14px", color: "#8B87A8", cursor: "pointer", fontSize: "13px" }}>
              {soundOn ? "🔊 On" : "🔇 Off"}
            </button>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#141226", border: "1px solid #231E47", borderRadius: "20px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #2EC4B6, #5B4FCF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🎭</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#E8E6F0" }}>Emotion Recognition</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#8B87A8" }}>{message}</p>
            </div>
            <div style={{ fontSize: "12px", color: "#8B87A8", flexShrink: 0 }}>{currentQ + 1} / {QUESTIONS.length}</div>
          </div>

          <div style={{ height: "6px", background: "#2A2456", borderRadius: "99px", marginBottom: "24px", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #2EC4B6, #5B4FCF)", width: `${progress}%`, transition: "width 0.3s ease" }} />
          </div>

          {/* ✅ Emotion image - bigger size */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                style={{ width: "200px", height: "200px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid #2A2456", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <img src={questionData?.image} alt="Emotion" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </motion.div>
            </AnimatePresence>
          </div>

          <h2 style={{ fontSize: "17px", fontWeight: "600", color: "#E8E6F0", textAlign: "center", marginBottom: "20px" }}>
            {questionData?.question}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {questionData?.options.map((opt, i) => (
              <div key={i} style={getOptionStyle(opt, i)} onClick={() => handleOptionClick(opt, i)}>{opt.text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionScenerio;
