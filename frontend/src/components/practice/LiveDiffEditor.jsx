import { useState, useRef, useEffect, useMemo } from 'react'
import { Eye, EyeOff, Columns, AlignLeft } from 'lucide-react'

/**
 * Word-level live diff: compares original vs typed word by word
 * Returns array of { word, type: 'correct' | 'wrong' | 'pending' }
 */
const diffWords = (original, typed) => {
  const origWords = original.trim().split(/\s+/)
  const typedWords = typed.trim().split(/\s+/)
  return origWords.map((word, i) => {
    if (i >= typedWords.length || (i === typedWords.length - 1 && typedWords[i] === '')) {
      return { word, type: 'pending' }
    }
    // If the student is still typing the current last word, mark as pending
    if (i === typedWords.length - 1 && !typed.endsWith(' ') && !typed.endsWith('\n')) {
      // Partial match — check if it's a prefix
      if (word.toLowerCase().startsWith(typedWords[i].toLowerCase())) {
        return { word, type: 'pending' }
      }
      return { word, type: 'wrong', typed: typedWords[i] }
    }
    if (typedWords[i].toLowerCase() === word.toLowerCase()) {
      return { word, type: 'correct' }
    }
    return { word, type: 'wrong', typed: typedWords[i] }
  })
}

const LiveDiffEditor = ({ transcript, typedText, onTextChange, disabled }) => {
  const [showReference, setShowReference] = useState(true)
  const [sideBySide, setSideBySide] = useState(true)
  const referenceRef = useRef(null)
  const textareaRef = useRef(null)

  const wordDiff = useMemo(() => {
    if (!transcript) return []
    return diffWords(transcript, typedText)
  }, [transcript, typedText])

  // Stats
  const stats = useMemo(() => {
    const correct = wordDiff.filter((w) => w.type === 'correct').length
    const wrong = wordDiff.filter((w) => w.type === 'wrong').length
    const pending = wordDiff.filter((w) => w.type === 'pending').length
    const total = wordDiff.length
    return { correct, wrong, pending, total }
  }, [wordDiff])

  // Sync scroll between reference panel and textarea
  const handleTextareaScroll = () => {
    if (referenceRef.current && textareaRef.current) {
      referenceRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  if (!transcript) return null

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReference(!showReference)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {showReference ? <EyeOff size={14} /> : <Eye size={14} />}
            {showReference ? 'Hide' : 'Show'} Reference
          </button>
          {showReference && (
            <button
              onClick={() => setSideBySide(!sideBySide)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {sideBySide ? <AlignLeft size={14} /> : <Columns size={14} />}
              {sideBySide ? 'Stacked' : 'Side by Side'}
            </button>
          )}
        </div>

        {/* Live error counter */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400">
            {stats.correct} correct
          </span>
          <span className="text-red-500 dark:text-red-400">
            {stats.wrong} {stats.wrong === 1 ? 'error' : 'errors'}
          </span>
          <span className="text-gray-400">
            {stats.pending} remaining
          </span>
        </div>
      </div>

      {/* Side-by-side panels */}
      <div className={`grid gap-4 ${showReference && sideBySide ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Reference Text (Teacher's transcript) */}
        {showReference && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Reference Text
              </span>
              <span className="text-xs text-gray-400">{stats.total} words</span>
            </div>
            <div
              ref={referenceRef}
              className="flex-1 font-mono text-sm leading-relaxed p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto whitespace-pre-wrap break-words"
              style={{ minHeight: '320px', maxHeight: '450px' }}
            >
              {wordDiff.map((item, i) => (
                <span key={i} className="relative group">
                  <span
                    className={`${
                      item.type === 'correct'
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded px-0.5'
                        : item.type === 'wrong'
                        ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded px-0.5 underline decoration-wavy decoration-red-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {item.word}
                  </span>
                  {/* Tooltip for wrong words showing what was typed */}
                  {item.type === 'wrong' && item.typed && (
                    <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                      You typed: <strong>{item.typed}</strong>
                    </span>
                  )}
                  {i < wordDiff.length - 1 && ' '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Typing Area */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Your Transcription
            </span>
            <span className="text-xs text-gray-400">
              {typedText.trim().split(/\s+/).filter(Boolean).length} words typed
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={typedText}
            onChange={onTextChange}
            onPaste={(e) => e.preventDefault()}
            onScroll={handleTextareaScroll}
            placeholder="Start typing here as you listen... errors will be highlighted in the reference text in real-time"
            className="flex-1 resize-none font-mono text-sm input-field leading-relaxed"
            style={{ minHeight: '320px', maxHeight: '450px' }}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className="h-full flex">
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-300"
            style={{ width: `${stats.total > 0 ? (stats.wrong / stats.total) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default LiveDiffEditor
