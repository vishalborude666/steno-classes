import { useState, useMemo, useEffect, useRef } from 'react'
import { diffTexts } from '../../utils/wpmCalculator'

const WordSpan = ({ item }) => {
  const cls =
    item.type === 'correct'
      ? 'text-emerald-700 bg-emerald-100 rounded px-0.5'
      : item.type === 'wrong'
      ? 'text-red-700 bg-red-100 rounded underline decoration-wavy decoration-red-400 px-0.5'
      : item.type === 'extra'
      ? 'text-orange-700 bg-orange-100 rounded px-0.5'
      : 'text-gray-500'
  return <span className={cls}>{item.word}</span>
}

const buildWordDiff = (original, typed) => {
  if (!original) return { refWords: [], typedWords: [], errors: [] }
  const { result, typedExtras } = diffTexts(original, typed || '')
  const errors = []

  const refWords = result.map((item, i) => {
    const word = item.char
    if (item.type === 'correct') return { word, type: 'correct' }
    if (item.type === 'wrong') {
      errors.push({ index: i + 1, expected: word.trim(), typed: item.typed || '(mistyped)' })
      return { word, type: 'wrong' }
    }
    errors.push({ index: i + 1, expected: word.trim(), typed: '(missing)' })
    return { word, type: 'missing' }
  })

  const typedDiffWords = result.map((item) => {
    if (item.type === 'correct') return { word: item.char, type: 'correct' }
    if (item.type === 'wrong') return { word: (item.typed || '___'), type: 'wrong' }
    return { word: '___', type: 'missing' }
  })

  if (typedExtras && typedExtras.length) {
    typedExtras.forEach((e) => typedDiffWords.push({ word: e.word, type: 'extra' }))
  }

  return { refWords, typedWords: typedDiffWords, errors }
}

const formatStat = (n) => n || 0

export default function TranscriptionComparePage() {
  const [teacher, setTeacher] = useState('')
  const [student, setStudent] = useState('')
  const [realtime, setRealtime] = useState(true)
  const [duration, setDuration] = useState(60)
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(duration)
  const timerRef = useRef(null)

  useEffect(() => setTimeLeft(duration), [duration])

  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [running])

  const { refWords, typedWords, errors } = useMemo(() => buildWordDiff(teacher, student), [teacher, student])

  const total = refWords.length
  const correct = refWords.filter((w) => w.type === 'correct').length
  const wrong = refWords.filter((w) => w.type === 'wrong').length
  const missing = refWords.filter((w) => w.type === 'missing').length
  const extra = typedWords.filter((w) => w.type === 'extra').length
  const accuracy = total === 0 ? 100 : Math.round((correct / total) * 100)

  const handleSubmit = (e) => {
    e && e.preventDefault()
    // If realtime is off, the memo will update on this submit state change
    // Nothing else needed because buildWordDiff reads states
  }

  const startTimer = () => {
    setStudent('')
    setRunning(true)
    setTimeLeft(duration)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Transcription Comparison Tool</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <label className="block text-sm font-medium">Teacher Paragraph</label>
          <textarea value={teacher} onChange={(e) => setTeacher(e.target.value)} rows={6} className="w-full p-3 rounded border" placeholder="Paste teacher/original paragraph here" />

          <label className="block text-sm font-medium">Student Input</label>
          <textarea value={student} onChange={(e) => setStudent(e.target.value)} rows={6} className="w-full p-3 rounded border" placeholder="Type or paste student input here" />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={realtime} onChange={(e) => setRealtime(e.target.checked)} /> Real-time</label>
            <button type="submit" onClick={handleSubmit} className="btn-primary px-3 py-1">Submit</button>
            <div className="ml-auto flex items-center gap-2">
              <label className="text-sm">Timer (sec)</label>
              <input type="number" min={5} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 0)} className="w-24 p-1 border rounded" />
              <button type="button" onClick={startTimer} className="btn-secondary px-3 py-1">Start</button>
              <div className="text-sm">{running ? `Time left: ${timeLeft}s` : 'Stopped'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-600 mb-2">Stats</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total words: <strong>{formatStat(total)}</strong></div>
              <div>Correct: <strong className="text-emerald-700">{formatStat(correct)}</strong></div>
              <div>गलत: <strong className="text-red-700">{formatStat(wrong)}</strong></div>
              <div>Missing: <strong className="text-gray-600">{formatStat(missing)}</strong></div>
              <div>Extra: <strong className="text-orange-700">{formatStat(extra)}</strong></div>
              <div>Accuracy: <strong>{accuracy}%</strong></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-600 mb-2">Errors</div>
            <div className="text-xs max-h-48 overflow-y-auto">
              {errors.length === 0 ? <div className="text-gray-400">No errors</div> : errors.map((err, i) => (
                <div key={i} className="mb-1"><strong>#{err.index}</strong> Expected: {err.expected} — Typed: {err.typed}</div>
              ))}
            </div>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div>
          <div className="text-xs font-semibold mb-2">Reference Text</div>
          <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap break-words border" style={{ minHeight: 200 }}>
            {refWords.map((item, i) => <WordSpan key={i} item={item} />)}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2">Student Text</div>
          <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap break-words border" style={{ minHeight: 200 }}>
            {typedWords.map((item, i) => <WordSpan key={i} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
