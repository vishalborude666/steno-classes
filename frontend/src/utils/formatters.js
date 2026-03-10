import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy')
export const formatDateTime = (date) => format(new Date(date), 'MMM dd, yyyy HH:mm')
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1)

export const getAccuracyColor = (accuracy) => {
  if (accuracy >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (accuracy >= 75) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

export const getWPMColor = (wpm) => {
  if (wpm >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (wpm >= 50) return 'text-primary-600 dark:text-primary-400'
  return 'text-amber-600 dark:text-amber-400'
}
