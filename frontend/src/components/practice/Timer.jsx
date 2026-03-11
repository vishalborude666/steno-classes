import { useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useTimer } from '../../hooks/useTimer'
import { formatTime } from '../../utils/formatters'

const Timer = ({ durationSeconds = 300, onExpire, onTick, autoStart = false }) => {
  const { seconds, elapsed, isRunning, progress, start, pause, reset } = useTimer(durationSeconds, onExpire)

  useEffect(() => {
    if (autoStart) start()
  }, [autoStart])

  useEffect(() => {
    onTick?.(elapsed)
  }, [elapsed])

  const circumference = 2 * Math.PI * 45
  const strokeDash = circumference - (progress / 100) * circumference
  const isUrgent = seconds <= 30

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Ring */}
      <div className="relative">
        <svg width="120" height="120" className="rotate-[-90deg]">
          <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor"
            className="text-gray-200 dark:text-gray-700" strokeWidth="8" />
          <circle cx="60" cy="60" r="45" fill="none"
            stroke={isUrgent ? '#ef4444' : '#8A2BE2'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono font-bold text-xl ${isUrgent ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={isRunning ? pause : start}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            isRunning
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400'
          }`}
        >
          {isRunning ? <><Pause size={14} />Pause</> : <><Play size={14} />Start</>}
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">Elapsed: {formatTime(elapsed)}</p>
    </div>
  )
}

export default Timer
