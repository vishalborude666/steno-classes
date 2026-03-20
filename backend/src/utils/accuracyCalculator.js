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

  const originalWords = original
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const typedWords = (typed || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const totalWords = originalWords.length;

  // Use Longest Common Subsequence (LCS) at word level to allow for
  // single missing/extra words without shifting all subsequent matches.
  const m = totalWords;
  const n = typedWords.length;

  if (m === 0) {
    return { accuracy: 100, mistakeCount: 0 };
  }

  // DP table (only keep two rows)
  const prev = new Array(n + 1).fill(0);
  const curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (originalWords[i - 1] === typedWords[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    // copy curr to prev, and reset curr
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
    curr.fill(0);
  }

  const correct = prev[n];
  const mistakeCount = totalWords - correct;
  const accuracy = Math.round((correct / totalWords) * 100);

  return { accuracy, mistakeCount };
};

module.exports = { calculateAccuracy };
