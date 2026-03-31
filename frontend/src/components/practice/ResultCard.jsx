import { useMemo } from 'react'
import { CheckCircle, XCircle, Zap, Clock, Target, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatTime, getAccuracyColor, getWPMColor } from '../../utils/formatters'

/**
 * Word-level diff for both panels
 * Returns { refWords, typedWords, errors }
 */
import { diffTexts } from '../../utils/wpmCalculator'

const buildWordDiff = (original, typed) => {
  if (!original) return { refWords: [], typedWords: [], errors: [] }
  const { result, typedResult } = diffTexts(original, typed || '')
  const errors = []

    const refWords = result.map((item, i) => {
      // keep original token including trailing whitespace so rendering preserves spacing
      const word = item.char
      if (item.type === 'correct') return { word, type: 'correct' }
      if (item.type === 'wrong') {
        errors.push({ index: i + 1, expected: word.trim(), typed: item.typed || '(mistyped)' })
        return { word, type: 'wrong' }
      }
      // missing
      errors.push({ index: i + 1, expected: word.trim(), typed: '(missing)' })
      return { word, type: 'missing' }
    })

    // build typed side using typedResult (preserves student spacing)
    const typedDiffWords = (typedResult || []).map((t) => {
      if (t.type === 'correct') return { word: t.word, type: 'correct' }
      if (t.type === 'wrong') return { word: t.word, type: 'wrong' }
      if (t.type === 'extra') return { word: t.word, type: 'extra' }
      return { word: t.word || '___', type: 'missing' }
    })

  return { refWords, typedWords: typedDiffWords, errors }
}

const WordSpan = ({ item }) => {
  const cls =
    item.type === 'correct'
      ? 'text-emerald-600 dark:text-emerald-400'
      : item.type === 'wrong'
      ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded px-0.5 underline decoration-wavy decoration-red-400'
      : item.type === 'missing'
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

      {/* Transcript with inline error highlights */}
      {transcript && (
        <div className="card max-w-5xl mx-auto">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Transcript Comparison</h4>
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
              </span>
            ))}
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
