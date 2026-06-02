export const getFemaleVoice = () => {
  const voices = window.speechSynthesis.getVoices();

  // try to find female-like English voice
  return (
    voices.find(v =>
      v.lang.includes("en") &&
      (v.name.toLowerCase().includes("female") ||
       v.name.toLowerCase().includes("google"))
    ) || voices[0]
  );
};

export const speakText = (text) => {
  if (!text) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  const voice = getFemaleVoice();
  if (voice) speech.voice = voice;

  speech.lang = "en-US";
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
};

// backward compatibility (tumhara old code safe rahe)
export const speak = speakText;