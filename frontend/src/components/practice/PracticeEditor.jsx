import { useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipboardPaste, Send } from 'lucide-react'
import AudioPlayer from './AudioPlayer'
import Timer from './Timer'
import ResultCard from './ResultCard'
import LiveDiffEditor from './LiveDiffEditor'
import { submitPractice } from '../../features/practice/practiceSlice'
import { calculateWPM, calculateAccuracy } from '../../utils/wpmCalculator'

// Use dictation-specific duration when provided (in seconds), fallback to 5 minutes

const PracticeEditor = ({ dictation }) => {
  const dispatch = useDispatch()
  const { submitting } = useSelector((state) => state.practice)

  const [typedText, setTypedText] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [timerExpired, setTimerExpired] = useState(false)
  const [result, setResult] = useState(null)
  const [timerStarted, setTimerStarted] = useState(false)
  const textareaRef = useRef(null)
  const startTimeRef = useRef(null)
  const typedTextRef = useRef('')

  // Keep ref in sync with state so callbacks always have latest value
  typedTextRef.current = typedText

  const handleExpire = useCallback(() => {
    setTimerExpired(true)
    // Use refs for latest values to avoid stale closures
    const actualElapsed = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 1
    const currentText = typedTextRef.current
    doSubmit(currentText, actualElapsed)
  }, [])

  const doSubmit = async (text, timeTaken) => {
    if (!text || !text.trim()) return
    const safeTime = Math.max(timeTaken, 1)
    const wpm = calculateWPM(text, safeTime)
    const { accuracy, mistakeCount } = calculateAccuracy(dictation.transcript || '', text)

    const payload = { dictationId: dictation._id, typedText: text, timeTaken: safeTime }
    const res = await dispatch(submitPractice(payload))

    if (submitPractice.fulfilled.match(res)) {
      setResult({ wpm, accuracy, mistakeCount, timeTaken: safeTime })
    }
  }

  const handleSubmit = () => {
    const actualElapsed = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 1
    doSubmit(typedText, actualElapsed)
  }

  const handleTextChange = (e) => {
    const value = e.target.value
    setTypedText(value)
    // Auto-start timer on first keystroke
    if (!timerStarted && value.length > 0) {
      setTimerStarted(true)
      startTimeRef.current = Date.now()
    }
  }

  // Live metrics
  const liveElapsed = elapsed || (timerStarted && startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0)
  const liveWPM = calculateWPM(typedText, Math.max(1, liveElapsed))
  const { accuracy: liveAccuracy } = calculateAccuracy(dictation.transcript || '', typedText)

  const handleRetry = () => {
    setTypedText('')
    setElapsed(0)
    setTimerExpired(false)
    setResult(null)
    setTimerStarted(false)
    startTimeRef.current = null
  }

  // Prevent paste
  const handlePaste = (e) => {
    e.preventDefault()
  }

  const getDifficultyBadgeClass = (diff) => {
    if (diff === 'easy') return 'badge-easy'
    if (diff === 'medium') return 'badge-medium'
    return 'badge-hard'
  }

  if (result) {
    return (
      <ResultCard
        result={result}
        dictationId={dictation._id}
        onRetry={handleRetry}
        transcript={dictation.transcript}
        typedText={typedText}
        language={dictation.dictationLanguage}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Left: Audio + Info (compact) */}
      <div className="lg:col-span-1 space-y-3">
        <div className="card p-3">
          <div className="flex items-start justify-between mb-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{dictation.title}</h2>
            <span className={`${getDifficultyBadgeClass(dictation.difficulty)} text-[10px] px-1.5 py-0.5`}>{dictation.difficulty}</span>
          </div>
          {dictation.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{dictation.description}</p>
          )}
        </div>

        {/* Audio */}
        {dictation.audioUrl && <AudioPlayer audioUrl={dictation.audioUrl} />}

        {/* Timer */}
        <div className="card p-3 flex flex-col items-center gap-1">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Timer</p>
          <Timer
            durationSeconds={dictation.durationSeconds || 300}
            onExpire={handleExpire}
            onTick={setElapsed}
            autoStart={timerStarted}
          />
        </div>
      </div>

      {/* Right: Typing area (wider) */}
      <div className="lg:col-span-3 space-y-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Your Transcription</h3>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {typedText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-lg text-sm font-semibold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30">
                {liveWPM} WPM
              </div>
              <div className="px-3 py-1 rounded-lg text-sm font-semibold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30">
                {liveAccuracy}% acc
              </div>
            </div>
            <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {typedText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <LiveDiffEditor
            transcript={dictation.transcript}
            typedText={typedText}
            onTextChange={(e) => handleTextChange(e)}
            disabled={timerExpired}
            language={dictation.dictationLanguage}
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <ClipboardPaste size={13} />
              Paste disabled for fair practice
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting || !typedText.trim()}
              className="btn-primary flex items-center gap-2"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <Send size={16} />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeEditor
