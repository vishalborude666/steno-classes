/**
 * WPM Calculator (client-side mirror)
 * 1 word = 5 characters (stenography standard)
 */
export const calculateWPM = (typedText, timeTakenSeconds) => {
  if (!timeTakenSeconds || timeTakenSeconds <= 0) return 0
  // Count only non-whitespace characters (do not count spaces or tabs)
  const charCount = (typedText || '').replace(/[\s\t]+/g, '').length
  const words = charCount / 5
  const minutes = timeTakenSeconds / 60
  return Math.round(words / minutes)
}

/**
 * Word-level accuracy calculation
 */
export const calculateAccuracy = (original, typed) => {
  if (!original || original.trim() === '') return { accuracy: 100, mistakeCount: 0 }

  const originalWords = original.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const typedWords = (typed || '').trim().toLowerCase().split(/\s+/).filter(Boolean)

  const m = originalWords.length
  const n = typedWords.length
  if (m === 0) return { accuracy: 100, mistakeCount: 0 }

  // Build DP table for LCS (word-level)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (originalWords[i - 1] === typedWords[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  const correct = dp[m][n]
  const accuracy = Math.round((correct / m) * 100)
  return { accuracy, mistakeCount: m - correct }
}

/**
 * Character-level diff for highlighting
 * Returns array of { char, type: 'correct' | 'wrong' | 'missing' }
 */
export const diffTexts = (original, typed) => {
  // Tokenize original and typed preserving trailing whitespace so rendering keeps exact spacing
  const origTokens = original.match(/\S+\s*/g) || []
  const typedTokens = (typed || '').match(/\S+\s*/g) || []

  const origWords = origTokens.map((t) => t.trim().toLowerCase())
  const typedWords = typedTokens.map((t) => t.trim().toLowerCase())

  const m = origWords.length
  const n = typedWords.length

  // Build DP table for LCS (word-level)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origWords[i - 1] === typedWords[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  // Backtrack to produce a sequence of operations (in reverse)
  let i = m
  let j = n
  const ops = [] // {type: 'equal'|'delete'|'insert', i?, j?}
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i - 1] === typedWords[j - 1]) {
      ops.push({ type: 'equal', i: i - 1, j: j - 1 })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: 'insert', j: j - 1 })
      j--
    } else if (i > 0) {
      ops.push({ type: 'delete', i: i - 1 })
      i--
    }
  }

  ops.reverse()

  // Convert ops into aligned results for original and typed sides
  const result = [] // for original tokens
  const typedResult = [] // for typed tokens in order

  for (let k = 0; k < ops.length; k++) {
    const op = ops[k]
    if (op.type === 'equal') {
      result.push({ char: origTokens[op.i], type: 'correct' })
      typedResult.push({ word: typedTokens[op.j], type: 'correct' })
    } else if (op.type === 'delete') {
      const next = ops[k + 1]
      if (next && next.type === 'insert') {
        // substitution
        result.push({ char: origTokens[op.i], type: 'wrong', typed: typedTokens[next.j] })
        typedResult.push({ word: typedTokens[next.j], type: 'wrong' })
        k++ // consume insert
      } else {
        result.push({ char: origTokens[op.i], type: 'missing' })
      }
    } else if (op.type === 'insert') {
      // typed extra not associated with an original token
      typedResult.push({ word: typedTokens[op.j], type: 'extra' })
    }
  }

  // If there are remaining original tokens, mark them missing
  for (let idx = result.length; idx < origTokens.length; idx++) {
    result.push({ char: origTokens[idx], type: 'missing' })
  }

  return { result, typedResult }
}
