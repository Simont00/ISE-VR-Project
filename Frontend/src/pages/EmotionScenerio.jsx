import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

// General Infrastructure Assets
import animeLeft from "../assets/anime-left.png";
import animeRight from "../assets/anime-right.png";
import bgPattern from "../assets/bg-pattern.png";
import teacher from "../assets/teacher.png";

// Dynamic Expression Asset Mapping
import happyImg from "../assets/emotions/happy.png";
import sadImg from "../assets/emotions/sad.png";
import angryImg from "../assets/emotions/angry.png";
import confusedImg from "../assets/emotions/confused.png";
import calmImg from "../assets/emotions/calm.png";

// Core Engine Engine Blocks
import { calculateProgress, validateAnswer } from "../utils/learningEngine";
import { getFemaleVoice, speakText } from "../utils/voice";

const EmotionScenerio = () => {
  // Balanced Dynamic Scenario Object
  const dynamicEmotionBank = [
    { question: "What emotion is represented here?", image: happyImg, options: [{ text: "Happy", isCorrect: true }, { text: "Sad", isCorrect: false }, { text: "Angry", isCorrect: false }, { text: "Calm", isCorrect: false }] },
    { question: "Can you identify this feeling?", image: sadImg, options: [{ text: "Confused", isCorrect: false }, { text: "Sad", isCorrect: true }, { text: "Happy", isCorrect: false }, { text: "Angry", isCorrect: false }] },
    { question: "Look closely, what emotion is this?", image: angryImg, options: [{ text: "Calm", isCorrect: false }, { text: "Happy", isCorrect: false }, { text: "Angry", isCorrect: true }, { text: "Sad", isCorrect: false }] },
    { question: "How is this person feeling right now?", image: confusedImg, options: [{ text: "Happy", isCorrect: false }, { text: "Confused", isCorrect: true }, { text: "Calm", isCorrect: false }, { text: "Angry", isCorrect: false }] },
    { question: "Identify this peaceful state:", image: calmImg, options: [{ text: "Angry", isCorrect: false }, { text: "Sad", isCorrect: false }, { text: "Calm", isCorrect: true }, { text: "Happy", isCorrect: false }] }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [message, setMessage] = useState("Observe expressions carefully 👀");
  const [sessionComplete, setSessionComplete] = useState(false);
  const [voice, setVoice] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const questionData = dynamicEmotionBank[currentQ];

  useEffect(() => {
    const initVoice = () => {
      setVoice(getFemaleVoice());
    };
    initVoice();
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.onvoiceschanged = initVoice;
    }
  }, []);

  useEffect(() => {
    if (!voice || sessionComplete) return;
    speakText(questionData.question, voice, soundOn);
  }, [currentQ, voice, sessionComplete]);

  const handleOptionClick = (opt, index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);

    if (validateAnswer(opt)) {
      setMessage("Correct answer ✅");
      speakText("Correct answer", voice, soundOn);
      setTimeout(() => {
        setSelectedIndex(null);
        if (currentQ < dynamicEmotionBank.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setMessage("Observe expressions carefully 👀");
        } else {
          setSessionComplete(true);
          speakText("Session completed", voice, soundOn);
        }
      }, 1200);
    } else {
      setMessage("Wrong answer, try again ❌");
      speakText("Wrong answer, try again", voice, soundOn);
      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("Observe expressions carefully 👀");
      }, 1200);
    }
  };

  const progress = calculateProgress(currentQ, dynamicEmotionBank.length);

  if (sessionComplete) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyCenter: "center", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #fbcfe8, #dbeafe)" }} className="flex items-center justify-center">
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />
        <div className="bg-white/90 p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 z-10">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-gray-800">Expression Sync Complete!</h1>
          <p className="text-gray-600 my-3">Excellent emotional recognition precision verified.</p>
          <button onClick={() => { setCurrentQ(0); setSessionComplete(false); }} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-xl font-medium shadow-md">Restart Evaluation</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }} className="flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 p-4">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${bgPattern})`, backgroundRepeat: "repeat" }} />
      <img src={animeLeft} className="absolute left-0 w-44 hidden lg:block" alt="" />
      <img src={animeRight} className="absolute right-0 w-44 hidden lg:block" alt="" />

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden z-10 border border-white/20">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={teacher} className="w-10 h-10 rounded-xl shadow-sm" alt="" />
            <div>
              <h2 className="font-bold text-gray-800 text-sm md:text-base">Emotion Recognition Module</h2>
              <p className="text-xs text-indigo-600 font-medium">{message}</p>
            </div>
          </div>
          <button onClick={() => setSoundOn(!soundOn)} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center border text-sm">{soundOn ? "🔊" : "🔇"}</button>
        </div>

        <div className="h-1.5 bg-gray-100">
          <div className="h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-8 text-center">
          <div className="w-36 h-36 mx-auto mb-4 bg-white rounded-2xl shadow-inner flex items-center justify-center p-2 border border-gray-50">
            <img src={questionData?.image} className="max-h-full object-contain" alt="Expression matrix" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{questionData?.question}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 pt-0">
          {questionData?.options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            let cardStyle = "border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 text-gray-700";
            if (isSelected && opt.isCorrect) cardStyle = "border-green-500 bg-green-50 text-green-700 font-semibold shadow-sm";
            if (isSelected && !opt.isCorrect) cardStyle = "border-red-500 bg-red-50 text-red-700 font-semibold";

            return (
              <div key={i} onClick={() => handleOptionClick(opt, i)} className={`p-4 border-2 rounded-xl text-center cursor-pointer font-medium transition-all duration-150 select-none text-sm md:text-base ${cardStyle}`}>
                {opt.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmotionScenerio;