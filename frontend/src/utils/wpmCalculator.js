/**
 * WPM Calculator (client-side mirror)
 * 1 word = 5 characters (stenography standard)
 */
export const calculateWPM = (typedText, timeTakenSeconds) => {
  if (!timeTakenSeconds || timeTakenSeconds <= 0) return 0
  const charCount = typedText.trim().replace(/\s+/g, ' ').length
  const words = charCount / 5
  const minutes = timeTakenSeconds / 60
  return Math.round(words / minutes)
}

/**
 * Word-level accuracy calculation
 */
export const calculateAccuracy = (original, typed) => {
  if (!original || original.trim() === '') return { accuracy: 100, mistakeCount: 0 }
  const originalWords = original.trim().toLowerCase().split(/\s+/)
  const typedWords = typed.trim().toLowerCase().split(/\s+/)
  let correct = 0
  originalWords.forEach((word, i) => {
    if (typedWords[i] === word) correct++
  })
  const accuracy = Math.round((correct / originalWords.length) * 100)
  return { accuracy, mistakeCount: originalWords.length - correct }
}

/**
 * Character-level diff for highlighting
 * Returns array of { char, type: 'correct' | 'wrong' | 'missing' }
 */
export const diffTexts = (original, typed) => {
  const result = []
  const origChars = original.split('')
  const typedChars = typed.split('')
  const maxLen = Math.max(origChars.length, typedChars.length)
  for (let i = 0; i < maxLen; i++) {
    if (i >= origChars.length) break
    if (i >= typedChars.length) {
      result.push({ char: origChars[i], type: 'missing' })
    } else if (origChars[i] === typedChars[i]) {
      result.push({ char: origChars[i], type: 'correct' })
    } else {
      result.push({ char: origChars[i], type: 'wrong' })
    }
  }
  return result
}
