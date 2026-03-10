import { Trophy, Medal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getWPMColor, getAccuracyColor } from '../../utils/formatters'

const rankColors = [
  'text-yellow-500', // 1st
  'text-gray-400',   // 2nd
  'text-amber-700',  // 3rd
]

const LeaderboardTable = ({ data = [] }) => {
  const { user } = useSelector((state) => state.auth)

  if (!data.length) {
    return <p className="text-center text-gray-400 py-10 text-sm">No leaderboard data yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {['Rank', 'Student', 'Avg WPM', 'Avg Accuracy', 'Sessions', 'Best WPM'].map((h) => (
              <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((entry, i) => {
            const isMe = entry._id === user?._id
            return (
              <tr key={entry._id} className={`transition-colors ${isMe ? 'bg-primary-50 dark:bg-primary-950/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                <td className="py-3 px-3">
                  {i < 3 ? (
                    <Trophy size={18} className={rankColors[i]} />
                  ) : (
                    <span className="font-bold text-gray-500">#{i + 1}</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {entry.student?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-semibold ${isMe ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                      {entry.student?.name} {isMe && '(You)'}
                    </span>
                  </div>
                </td>
                <td className={`py-3 px-3 font-bold ${getWPMColor(entry.avgWpm)}`}>{entry.avgWpm}</td>
                <td className={`py-3 px-3 font-bold ${getAccuracyColor(entry.avgAccuracy)}`}>{entry.avgAccuracy}%</td>
                <td className="py-3 px-3 text-gray-500">{entry.totalSessions}</td>
                <td className={`py-3 px-3 font-bold ${getWPMColor(entry.bestWpm)}`}>{entry.bestWpm}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardTable
