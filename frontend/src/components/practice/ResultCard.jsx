import { useMemo } from 'react'
import { CheckCircle, XCircle, Zap, Clock, Target, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatTime, getAccuracyColor, getWPMColor } from '../../utils/formatters'

/**
 * Word-level diff for both panels
 * Returns { refWords, typedWords, errors }
 */
const buildWordDiff = (original, typed) => {
  if (!original) return { refWords: [], typedWords: [], errors: [] }
  const origWords = original.trim().split(/\s+/)
  const tWords = (typed || '').trim().split(/\s+/).filter(Boolean)
  const errors = []

  const refWords = origWords.map((word, i) => {
    const tw = tWords[i]
    if (tw === undefined) {
      errors.push({ index: i + 1, expected: word, typed: '(missing)' })
      return { word, type: 'missing' }
    }
    if (tw.toLowerCase() === word.toLowerCase()) {
      return { word, type: 'correct' }
    }
    errors.push({ index: i + 1, expected: word, typed: tw })
    return { word, type: 'wrong' }
  })

  const typedDiffWords = tWords.map((word, i) => {
    if (i >= origWords.length) {
      errors.push({ index: origWords.length + (i - origWords.length) + 1, expected: '—', typed: word })
      return { word, type: 'extra' }
    }
    if (word.toLowerCase() === origWords[i].toLowerCase()) {
      return { word, type: 'correct' }
    }
    return { word, type: 'wrong' }
  })

  // Add placeholders for missing words in typed panel
  if (tWords.length < origWords.length) {
    for (let i = tWords.length; i < origWords.length; i++) {
      typedDiffWords.push({ word: '___', type: 'missing' })
    }
  }

  return { refWords, typedWords: typedDiffWords, errors }
}

const WordSpan = ({ item }) => {
  const cls =
    item.type === 'correct'
      ? 'text-emerald-600 dark:text-emerald-400'
      : item.type === 'wrong'
      ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded px-0.5 underline decoration-wavy decoration-red-400'
      : item.type === 'extra'
      ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 rounded px-0.5'
      : 'text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 rounded px-0.5'
  return <span className={cls}>{item.word}</span>
}

const ResultCard = ({ result, dictationId, onRetry, transcript, typedText, language }) => {
  const { wpm, accuracy, timeTaken, mistakeCount } = result
  const isMarathi = language === 'marathi'
  const fontClass = isMarathi ? 'font-surekh text-base' : 'font-mono text-sm'

  const { refWords, typedWords, errors } = useMemo(
    () => buildWordDiff(transcript, typedText),
    [transcript, typedText]
  )

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Stats Card */}
      <div className="card max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            accuracy >= 75 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {accuracy >= 75
              ? <CheckCircle size={32} className="text-emerald-600 dark:text-emerald-400" />
              : <XCircle size={32} className="text-red-500" />}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {accuracy >= 90 ? 'Excellent!' : accuracy >= 75 ? 'Good Job!' : 'Keep Practicing!'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Here are your results</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4 text-center">
            <Zap size={20} className={`mx-auto mb-1 ${getWPMColor(wpm)}`} />
            <p className={`text-3xl font-extrabold ${getWPMColor(wpm)}`}>{wpm}</p>
            <p className="text-xs text-gray-500">WPM</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 text-center">
            <Target size={20} className={`mx-auto mb-1 ${getAccuracyColor(accuracy)}`} />
            <p className={`text-3xl font-extrabold ${getAccuracyColor(accuracy)}`}>{accuracy}%</p>
            <p className="text-xs text-gray-500">Accuracy</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
            <Clock size={20} className="mx-auto mb-1 text-gray-500" />
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{formatTime(timeTaken)}</p>
            <p className="text-xs text-gray-500">Time Taken</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
            <XCircle size={20} className="mx-auto mb-1 text-red-400" />
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{mistakeCount}</p>
            <p className="text-xs text-gray-500">Mistakes</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onRetry} className="btn-secondary flex-1">Try Again</button>
          <Link to={isMarathi ? '/marathi-practice' : '/practice'} className="btn-primary flex-1 text-center">Browse Dictations</Link>
        </div>
      </div>

      {/* Side-by-side Transcript Comparison */}
      {transcript && (
        <div className="card max-w-5xl mx-auto">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Transcript Comparison</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Reference Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reference Text</span>
                <span className="text-xs text-gray-400">{refWords.length} words</span>
              </div>
              <div
                className={`${fontClass} leading-relaxed p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto whitespace-pre-wrap break-words`}
                style={{ minHeight: '250px', maxHeight: '400px' }}
              >
                {refWords.map((item, i) => (
                  <span key={i}>
                    <WordSpan item={item} />
                    {i < refWords.length - 1 && ' '}
                  </span>
                ))}
              </div>
            </div>

            {/* Student's Typed Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Your Transcription</span>
                <span className="text-xs text-gray-400">{typedWords.filter(w => w.type !== 'missing').length} words typed</span>
              </div>
              <div
                className={`${fontClass} leading-relaxed p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto whitespace-pre-wrap break-words`}
                style={{ minHeight: '250px', maxHeight: '400px' }}
              >
                {typedWords.map((item, i) => (
                  <span key={i}>
                    <WordSpan item={item} />
                    {i < typedWords.length - 1 && ' '}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Color legend */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
              Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500 inline-block"></span>
              Wrong
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-600 inline-block"></span>
              Missing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-orange-500 inline-block"></span>
              Extra
            </span>
          </div>
        </div>
      )}

      {/* Error Details Table */}
      {errors.length > 0 && (
        <div className="card max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Error Details ({errors.length})</h4>
          </div>
          <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Word #</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Expected</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">You Typed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {errors.map((err, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-3 py-2 text-gray-400 font-mono text-xs">{err.index}</td>
                    <td className={`px-3 py-2 ${isMarathi ? 'font-surekh' : 'font-mono'}`}>
                      <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded px-1.5 py-0.5">
                        {err.expected}
                      </span>
                    </td>
                    <td className={`px-3 py-2 ${isMarathi ? 'font-surekh' : 'font-mono'}`}>
                      <span className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded px-1.5 py-0.5">
                        {err.typed}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {errors.length === 0 && transcript && (
        <div className="card max-w-5xl mx-auto text-center py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <CheckCircle size={24} className="mx-auto mb-2 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Perfect! No errors found.</p>
        </div>
      )}
    </div>
  )
}

export default ResultCard
