export const calculateProgress = (correct, total) => {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
};

export const validateAnswer = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return false;

  return userAnswer.toString().trim().toLowerCase() ===
         correctAnswer.toString().trim().toLowerCase();
};

// optional (tumhare existing functions mapped)
export const getFeedbackMessage = (isCorrect) => {
  return isCorrect
    ? "🎉 Great Job! You learned it well!"
    : "It's okay! Try again slowly.";
};

export const getLevel = (score) => {
  if (score < 2) return "Easy 🟢";
  if (score < 4) return "Medium 🟡";
  return "Hard 🔴";
};