import { useState, useEffect, useRef, useCallback } from 'react'

export const useTimer = (initialSeconds = 300, onExpire = null) => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  const start = useCallback(() => {
    setIsRunning(true)
    startTimeRef.current = Date.now() - elapsed * 1000
  }, [elapsed])

  const pause = useCallback(() => setIsRunning(false), [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setSeconds(initialSeconds)
    setElapsed(0)
    clearInterval(intervalRef.current)
  }, [initialSeconds])

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const newElapsed = e + 1
        setSeconds(Math.max(initialSeconds - newElapsed, 0))
        if (initialSeconds - newElapsed <= 0) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          onExpire?.()
        }
        return newElapsed
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, initialSeconds, onExpire])

  const progress = initialSeconds > 0 ? ((initialSeconds - seconds) / initialSeconds) * 100 : 0

  return { seconds, elapsed, isRunning, progress, start, pause, reset }
}
