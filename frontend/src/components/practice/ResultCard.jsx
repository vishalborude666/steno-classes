import { CheckCircle, XCircle, Zap, Clock, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatTime, getAccuracyColor, getWPMColor } from '../../utils/formatters'

const ResultCard = ({ result, dictationId, onRetry }) => {
  const { wpm, accuracy, timeTaken, mistakeCount } = result

  return (
    <div className="card max-w-md mx-auto text-center animate-slide-up">
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
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Here are your results</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
          <Zap size={20} className={`mx-auto mb-1 ${getWPMColor(wpm)}`} />
          <p className={`text-3xl font-extrabold ${getWPMColor(wpm)}`}>{wpm}</p>
          <p className="text-xs text-gray-500">WPM</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4">
          <Target size={20} className={`mx-auto mb-1 ${getAccuracyColor(accuracy)}`} />
          <p className={`text-3xl font-extrabold ${getAccuracyColor(accuracy)}`}>{accuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <Clock size={20} className="mx-auto mb-1 text-gray-500" />
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{formatTime(timeTaken)}</p>
          <p className="text-xs text-gray-500">Time Taken</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <XCircle size={20} className="mx-auto mb-1 text-red-400" />
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{mistakeCount}</p>
          <p className="text-xs text-gray-500">Mistakes</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRetry} className="btn-secondary flex-1">Try Again</button>
        <Link to="/practice" className="btn-primary flex-1 text-center">Browse Dictations</Link>
      </div>
    </div>
  )
}

export default ResultCard
