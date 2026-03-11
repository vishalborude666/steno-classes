import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { formatDate } from '../../utils/formatters'

const ProgressChart = ({ data = [] }) => {
  const chartData = data.map((p) => ({
    date: formatDate(p.completedAt).slice(0, 6),
    WPM: p.wpm,
    Accuracy: p.accuracy,
  }))

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No practice data yet. Start practicing to see your progress!
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-gray-500" />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            background: '#411287',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '13px',
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="WPM" stroke="#9B3DE8" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Accuracy" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ProgressChart
