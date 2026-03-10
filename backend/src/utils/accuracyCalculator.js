/**
 * Accuracy Calculator — word-level comparison
 * @param {string} original  - The correct transcript text
 * @param {string} typed     - What the student typed
 * @returns {{ accuracy: number, mistakeCount: number }}
 */
const calculateAccuracy = (original, typed) => {
  if (!original || original.trim() === '') {
    return { accuracy: 100, mistakeCount: 0 };
  }

  const originalWords = original.trim().toLowerCase().split(/\s+/);
  const typedWords = typed.trim().toLowerCase().split(/\s+/);

  let correct = 0;
  const totalWords = originalWords.length;

  originalWords.forEach((word, i) => {
    if (typedWords[i] === word) {
      correct++;
    }
  });

  const accuracy = Math.round((correct / totalWords) * 100);
  const mistakeCount = totalWords - correct;

  return { accuracy, mistakeCount };
};

module.exports = { calculateAccuracy };
