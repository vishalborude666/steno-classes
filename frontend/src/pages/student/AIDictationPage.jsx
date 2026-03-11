import { useState, useRef, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Sparkles, Play, Pause, Square, Volume2, RotateCcw, Send, ClipboardPaste,
  ArrowLeft, Settings, Zap, ChevronDown, Loader2, Clock, Target, Type, VolumeX,
} from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import ResultCard from '../../components/practice/ResultCard'
import { generateAIDictation, submitAIPractice, resetAIDictation } from '../../features/aiDictation/aiDictationSlice'
import { calculateWPM, calculateAccuracy } from '../../utils/wpmCalculator'

const TOPICS = [
  'Education', 'Technology', 'Government', 'Economy', 'Society',
  'Health', 'Environment', 'Science', 'Sports', 'Law', 'Business', 'Culture',
]

const WPM_OPTIONS = [40, 60, 80, 100, 120, 140, 160, 180]
const DURATION_OPTIONS = [1, 2, 3, 4, 5]

// TTS Hook
const useSpeechSynthesis = () => {
  const utteranceRef = useRef(null)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
  }, [])

  const speak = useCallback((text, rate = 1) => {
    if (!supported) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate
    u.pitch = 1
    u.lang = 'en-US'
    // Try to pick a good voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'))
    if (preferred) u.voice = preferred
    u.onstart = () => { setSpeaking(true); setPaused(false) }
    u.onend = () => { setSpeaking(false); setPaused(false) }
    u.onerror = () => { setSpeaking(false); setPaused(false) }
    utteranceRef.current = u
    window.speechSynthesis.speak(u)
  }, [supported])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setPaused(true)
  }, [])

  const resume = useCallback(() => {
    window.speechSynthesis.resume()
    setPaused(false)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }, [])

  return { speak, pause, resume, stop, speaking, paused, supported }
}

const AIDictationPage = () => {
  const dispatch = useDispatch()
  const { passage, topic: generatedTopic, generating, submitting, lastResult, error } = useSelector((s) => s.aiDictation)
  const tts = useSpeechSynthesis()

  // Settings
  const [topic, setTopic] = useState('')
  const [wpm, setWpm] = useState(80)
  const [duration, setDuration] = useState(2)
  // Practice state
  const [typedText, setTypedText] = useState('')
  const [timerStarted, setTimerStarted] = useState(false)
  const [result, setResult] = useState(null)
  const startTimeRef = useRef(null)
  const typedTextRef = useRef('')
  const textareaRef = useRef(null)
  typedTextRef.current = typedText

  // Convert WPM to speech rate (default ~150 WPM)
  const speechRate = Math.max(0.3, Math.min(wpm / 150, 2))

  const handleGenerate = async () => {
    await dispatch(generateAIDictation({ topic: topic || undefined, wpm, duration }))
    setTypedText('')
    setResult(null)
    setTimerStarted(false)
    startTimeRef.current = null
    tts.stop()
  }

  const handleSpeak = () => {
    if (!passage) return
    if (tts.speaking && !tts.paused) {
      tts.pause()
    } else if (tts.paused) {
      tts.resume()
    } else {
      tts.speak(passage, speechRate)
    }
  }

  const handleStopSpeech = () => tts.stop()

  const handleTextChange = (e) => {
    const value = e.target.value
    setTypedText(value)
    if (!timerStarted && value.length > 0) {
      setTimerStarted(true)
      startTimeRef.current = Date.now()
    }
  }

  const handlePaste = (e) => e.preventDefault()

  const handleSubmit = async () => {
    if (!typedText.trim() || !passage) return
    const timeTaken = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 1
    const safeTime = Math.max(timeTaken, 1)
    const wpmCalc = calculateWPM(typedText, safeTime)
    const { accuracy, mistakeCount } = calculateAccuracy(passage, typedText)

    const res = await dispatch(submitAIPractice({ transcript: passage, typedText, timeTaken: safeTime, topic: generatedTopic }))
    if (submitAIPractice.fulfilled.match(res)) {
      setResult({ wpm: wpmCalc, accuracy, mistakeCount, timeTaken: safeTime })
      tts.stop()
    }
  }

  const handleReset = () => {
    dispatch(resetAIDictation())
    setTypedText('')
    setResult(null)
    setTimerStarted(false)
    startTimeRef.current = null
    tts.stop()
  }

  const handleRetry = () => {
    setTypedText('')
    setResult(null)
    setTimerStarted(false)
    startTimeRef.current = null
  }

  const elapsed = timerStarted && startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0

  // Live timer update
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!timerStarted) return
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [timerStarted])

  const currentElapsed = timerStarted && startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0
  const minutes = Math.floor(currentElapsed / 60)
  const seconds = currentElapsed % 60

  // Show result
  if (result && passage) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <button onClick={handleReset} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-5 text-sm transition-colors">
            <ArrowLeft size={16} /> New AI Dictation
          </button>
          <ResultCard
            result={result}
            onRetry={handleRetry}
            transcript={passage}
            typedText={typedText}
          />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-amber-500" size={24} />
              AI Dictation Practice
            </h1>
            <p className="text-sm text-gray-500 mt-1">Generate custom dictation passages & practice with text-to-speech</p>
          </div>
          <Link to="/practice" className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1">
            <ArrowLeft size={14} /> Regular Practice
          </Link>
        </div>

        {!passage ? (
          /* ─── SETTINGS FORM ─── */
          <div className="card max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Settings size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Configure Dictation</h2>
            </div>

            {/* Topic */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Topic <span className="text-gray-400 font-normal">(optional — leave blank for random)</span>
              </label>
              <div className="relative">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">🎲 Random Topic</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* WPM */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                Speed (WPM)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {WPM_OPTIONS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWpm(w)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      wpm === w
                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-400'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-500" />
                Duration (minutes)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      duration === d
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/25'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{wpm * duration}</span> words at{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{wpm} WPM</span> for{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{duration} min</span>
              </div>
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-full font-semibold">
                {topic || 'Random'}
              </span>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {generating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Dictation
                </>
              )}
            </button>

            {!tts.supported && (
              <p className="text-xs text-amber-600 mt-3 text-center">
                ⚠️ Your browser doesn't support text-to-speech. You can still read & type the dictation.
              </p>
            )}
          </div>
        ) : (
          /* ─── PRACTICE AREA ─── */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left: Controls */}
            <div className="lg:col-span-1 space-y-3">
              {/* Info Card */}
              <div className="card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">AI Generated</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between"><span>Topic</span><span className="font-semibold text-gray-700 dark:text-gray-300">{generatedTopic}</span></div>
                  <div className="flex justify-between"><span>Target WPM</span><span className="font-semibold text-gray-700 dark:text-gray-300">{wpm}</span></div>
                  <div className="flex justify-between"><span>Duration</span><span className="font-semibold text-gray-700 dark:text-gray-300">{duration} min</span></div>
                  <div className="flex justify-between"><span>Words</span><span className="font-semibold text-gray-700 dark:text-gray-300">{passage.split(/\s+/).length}</span></div>
                </div>
              </div>

              {/* TTS Controls */}
              <div className="card p-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Volume2 size={14} /> Audio Playback
                </p>
                {tts.supported ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handleSpeak}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                          tts.speaking && !tts.paused
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50'
                        }`}
                      >
                        {tts.speaking && !tts.paused ? <><Pause size={14} /> Pause</> : tts.paused ? <><Play size={14} /> Resume</> : <><Play size={14} /> Play</>}
                      </button>
                      {tts.speaking && (
                        <button onClick={handleStopSpeech} className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200">
                          <Square size={14} />
                        </button>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 text-center">
                      Speed: {speechRate.toFixed(2)}x ({wpm} WPM)
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <VolumeX size={14} /> TTS not supported
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className="card p-3 flex flex-col items-center gap-1">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Elapsed Time</p>
                <div className="text-3xl font-mono font-bold text-primary-600 dark:text-primary-400">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                {!timerStarted && (
                  <p className="text-[10px] text-gray-400">Starts when you type</p>
                )}
              </div>

              {/* New Dictation */}
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <RotateCcw size={13} /> New Dictation
              </button>
            </div>

            {/* Right: Passage + Typing */}
            <div className="lg:col-span-3 space-y-4">
              {/* Generated Passage */}
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target size={16} className="text-emerald-500" />
                    Dictation Passage
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {passage.split(/\s+/).length} words
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-h-48 overflow-y-auto font-serif">
                  {passage}
                </div>
              </div>

              {/* Typing Area */}
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Type size={16} className="text-primary-500" />
                    Your Transcription
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {typedText.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={typedText}
                  onChange={handleTextChange}
                  onPaste={handlePaste}
                  placeholder="Start typing here... (paste disabled for fair practice)"
                  rows={10}
                  className="w-full resize-none font-mono text-sm input-field leading-relaxed"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <ClipboardPaste size={13} /> Paste disabled for fair practice
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !typedText.trim()}
                    className="btn-primary flex items-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={16} /> Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AIDictationPage
