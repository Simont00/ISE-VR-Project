// src/utils/voice.js

export const speak = (text) => {
  // Stop any previous speech (important for fast clicking)
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 0.9;   // slow (ASD-friendly)
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
};