import { Link } from 'react-router-dom'
import { formatDate, getAccuracyColor, getWPMColor, formatTime } from '../../utils/formatters'
import { ExternalLink } from 'lucide-react'

const badgeClass = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' }

const HistoryTable = ({ history }) => {
  if (!history?.length) {
    return (
      <p className="text-center text-gray-400 py-10 text-sm">No practice sessions yet. Start practicing!</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {['Dictation', 'Difficulty', 'WPM', 'Accuracy', 'Time', 'Date', ''].map((h) => (
              <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {history.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="py-3 px-2 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                {p.isAI ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">AI</span>
                    {p.aiTopic || 'Random'}
                  </span>
                ) : (p.dictationId?.title || '—')}
              </td>
              <td className="py-3 px-2">
                {p.isAI ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">ai</span>
                ) : (
                  <span className={badgeClass[p.dictationId?.difficulty] || 'badge-medium'}>
                    {p.dictationId?.difficulty || '—'}
                  </span>
                )}
              </td>
              <td className={`py-3 px-2 font-bold ${getWPMColor(p.wpm)}`}>{p.wpm}</td>
              <td className={`py-3 px-2 font-bold ${getAccuracyColor(p.accuracy)}`}>{p.accuracy}%</td>
              <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{formatTime(p.timeTaken)}</td>
              <td className="py-3 px-2 text-gray-400">{formatDate(p.completedAt)}</td>
              <td className="py-3 px-2">
                {p.dictationId?._id && (
                  <Link to={`/practice/${p.dictationId._id}`}
                    className="text-primary-500 hover:text-primary-700 transition-colors">
                    <ExternalLink size={14} />
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable
