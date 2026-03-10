/**
 * WPM Calculator — stenography standard: 1 word = 5 characters
 * @param {string} typedText
 * @param {number} timeTakenSeconds
 * @returns {number} wpm (rounded)
 */
const calculateWPM = (typedText, timeTakenSeconds) => {
  if (!timeTakenSeconds || timeTakenSeconds <= 0) return 0;
  const charCount = typedText.trim().replace(/\s+/g, ' ').length;
  const words = charCount / 5;
  const minutes = timeTakenSeconds / 60;
  return Math.round(words / minutes);
};

module.exports = { calculateWPM };
