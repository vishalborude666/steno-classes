/**
 * Returns a deterministic daily dictation index (no DB writes needed)
 * @param {number} totalDictations - count of active dictations
 * @returns {number} index into the dictations array
 */
const getDailyIndex = (totalDictations) => {
  if (totalDictations === 0) return 0;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % totalDictations;
};

module.exports = { getDailyIndex };
