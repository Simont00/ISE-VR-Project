<h1 style={{color:"red"}}>NEW COMPONENT LOADED</h1>
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

import animeLeft from "../assets/anime-left.png";
import animeRight from "../assets/anime-right.png";
import bgPattern from "../assets/bg-pattern.png";
import teacher from "../assets/teacher.png";

import happyImg from "../assets/emotions/happy.png";
import sadImg from "../assets/emotions/sad.png";
import angryImg from "../assets/emotions/angry.png";
import confusedImg from "../assets/emotions/confused.png";

const EmotionScenerio = () => {
  const questionBank = [
    {
      question: "What emotion is this?",
      image: happyImg,
      options: [
        { text: "Happy", isCorrect: true },
        { text: "Sad", isCorrect: false },
        { text: "Angry", isCorrect: false },
        { text: "Confused", isCorrect: false },
      ],
    },
    {
      question: "What emotion is this?",
      image: sadImg,
      options: [
        { text: "Happy", isCorrect: false },
        { text: "Sad", isCorrect: true },
        { text: "Angry", isCorrect: false },
        { text: "Confused", isCorrect: false },
      ],
    },
    {
      question: "What emotion is this?",
      image: angryImg,
      options: [
        { text: "Happy", isCorrect: false },
        { text: "Sad", isCorrect: false },
        { text: "Angry", isCorrect: true },
        { text: "Confused", isCorrect: false },
      ],
    },
    {
      question: "What emotion is this?",
      image: confusedImg,
      options: [
        { text: "Happy", isCorrect: false },
        { text: "Sad", isCorrect: false },
        { text: "Angry", isCorrect: false },
        { text: "Confused", isCorrect: true },
      ],
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [message, setMessage] = useState("Observe carefully 👀");

  const [sessionComplete, setSessionComplete] = useState(false);
  const [restarting, setRestarting] = useState(false);

  const [voice, setVoice] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const questionData = questionBank[currentQ];

  // ---------------- VOICE ----------------
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();

      const female =
        voices.find(v => v.name.toLowerCase().includes("female")) ||
        voices.find(v => v.name.toLowerCase().includes("zira")) ||
        voices.find(v => v.name.toLowerCase().includes("samantha")) ||
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

  // ---------------- CLICK LOGIC ----------------
  const handleOptionClick = (opt, index) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(index);
    setHoveredIndex(null);

    if (opt.isCorrect) {
      setMessage("Correct answer ✅");
      speak("Correct answer");

      setTimeout(() => {
        setSelectedIndex(null);

        if (currentQ < questionBank.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setMessage("Observe carefully 👀");
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
        setMessage("Observe carefully 👀");
      }, 1200);
    }
  };

  // ---------------- STYLE ----------------
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
        cursor: "default",
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
        cursor: "default",
      };
    }

    if (isHovered) {
      return {
        padding: "16px",
        borderRadius: "12px",
        border: "1.5px solid #60a5fa",
        background: "#eff6ff",
        color: "",
        cursor: "pointer",
        transform: "scale(1.02)",
      };
    }

    return {
      padding: "16px",
      borderRadius: "12px",
      border: "1.5px solid #e5e7eb",
      background: "#fff",
      cursor: selectedIndex !== null ? "default" : "pointer",
    };
  };

  // ---------------- RESTART ----------------
  const restartSession = () => {
    setRestarting(true);

    setTimeout(() => {
      setCurrentQ(0);
      setSelectedIndex(null);
      setHoveredIndex(null);
      setSessionComplete(false);
      setMessage("Observe carefully 👀");
      setRestarting(false);
    }, 800);
  };

  const progress = ((currentQ + 1) / questionBank.length) * 100;

  // ================= SESSION COMPLETE (FIXED GREETING STYLE) =================
  if (sessionComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">

        {/* BACKGROUND PATTERN (NO BLUR) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* CONFETTI */}
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={250}
        />

        {/* CARD */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 p-8 rounded-2xl shadow-xl text-center w-[90%] max-w-md"
          >
            <div className="text-5xl mb-3">🎉</div>

            {/* FIXED TEXT */}
            <h1 className="text-xl font-bold mb-2">
              Session Complete!
            </h1>

            <p className="text-gray-600 mb-5">
              Great job! You completed greeting practice.
            </p>

            <div className="flex justify-center gap-2 mb-5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>

            <button
              onClick={restartSession}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
            >
              {restarting ? "Restarting..." : "Restart Session"}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100">

      {/* BACKGROUND PATTERN */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundRepeat: "repeat",
        }}
      />

      <img src={animeLeft} className="absolute left-0 w-44 hidden md:block" />
      <img src={animeRight} className="absolute right-0 w-44 hidden md:block" />

      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between p-5 border-b">
          <div>
            <h2 className="font-semibold">Emotion Learning</h2>
            <p className="text-xs text-gray-500">{message}</p>
          </div>

          <button onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? "🔊" : "🔇"}
          </button>
        </div>

        {/* PROGRESS */}
        <div className="h-2 bg-gray-200">
          <div
            className="h-2 bg-gradient-to-r from-pink-400 to-blue-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* QUESTION */}
        <div className="p-5 text-center">
          <img src={questionData.image} className="w-40 mx-auto mb-3" />
          <h2 className="font-medium">{questionData.question}</h2>
        </div>

        {/* OPTIONS */}
        <div className="grid grid-cols-2 gap-4 p-5">
          {questionData.options.map((opt, i) => (
            <div
              key={i}
              style={getOptionStyle(opt, i)}
              onClick={() => handleOptionClick(opt, i)}
              onMouseEnter={() => setHoveredIndex(i)}
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

export default EmotionScenerio;