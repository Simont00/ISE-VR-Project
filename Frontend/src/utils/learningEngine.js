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