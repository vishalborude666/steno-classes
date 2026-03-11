import { useRef, useState, useCallback } from 'react'
import { Play, Pause, RotateCcw, Volume2, Gauge } from 'lucide-react'
import { formatTime } from '../../utils/formatters'

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(1)

  const toggle = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleSpeed = (s) => {
    setSpeed(s)
    if (audioRef.current) audioRef.current.playbackRate = s
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.pause()
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="card p-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/50 dark:to-purple-950/50">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={toggle}
          className="h-9 w-9 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-lg transition-colors flex-shrink-0"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-primary-200 dark:bg-primary-800 rounded-full appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{formatTime(Math.floor(currentTime))}</span>
            <span>{formatTime(Math.floor(duration))}</span>
          </div>
        </div>

        <button onClick={reset} className="p-1 text-gray-500 hover:text-primary-600 transition-colors">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Speed */}
        <div className="flex items-center gap-1.5">
          <Gauge size={12} className="text-gray-500" />
          <div className="flex gap-0.5">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  speed === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-100'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-1.5">
          <Volume2 size={12} className="text-gray-500" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolume}
            className="w-14 h-1 accent-primary-600"
          />
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
