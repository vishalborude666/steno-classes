import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Zap, Target, BookOpen, Trophy, Calendar, ArrowRight } from 'lucide-react'
import { fetchStats, fetchHistory } from '../../features/practice/practiceSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatsCard from '../../components/dashboard/StatsCard'
import ProgressChart from '../../components/dashboard/ProgressChart'
import HistoryTable from '../../components/dashboard/HistoryTable'
import Loader from '../../components/common/Loader'

const StudentDashboard = () => {
  const dispatch = useDispatch()
  const { stats, chartData, history, loading } = useSelector((state) => state.practice)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchStats())
    dispatch(fetchHistory({ limit: 5 }))
  }, [dispatch])

  if (loading && !stats) return <DashboardLayout><div className="flex justify-center py-20"><Loader size="lg" /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="card bg-gradient-to-r from-primary-700 to-primary-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Welcome back</p>
              <h1 className="text-2xl font-bold">{user?.name} 👋</h1>
              <p className="text-purple-200 text-sm mt-1">Keep practicing to improve your stenography skills</p>
            </div>
            <Link to="/practice" className="btn-primary bg-white text-primary-700 hover:bg-purple-50 flex items-center gap-2 whitespace-nowrap">
              Practice Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={BookOpen} label="Total Sessions" value={stats?.totalSessions || 0} color="blue" />
          <StatsCard icon={Zap} label="Avg WPM" value={stats?.avgWpm || 0} subValue="Words per minute" color="blue" />
          <StatsCard icon={Target} label="Avg Accuracy" value={`${stats?.avgAccuracy || 0}%`} subValue="Word accuracy" color="green" />
          <StatsCard icon={Trophy} label="Best WPM" value={stats?.bestWpm || 0} subValue="Personal best" color="amber" />
        </div>

        {/* Chart + Quick links */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Progress Over Time</h2>
            <ProgressChart data={chartData || []} />
          </div>

          <div className="space-y-3">
            <Link to="/daily-challenge" className="card flex items-center gap-3 hover:shadow-md transition-all group cursor-pointer border-amber-100 dark:border-amber-900/30">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-amber-600 transition-colors">Daily Challenge</p>
                <p className="text-xs text-gray-400">New challenge today!</p>
              </div>
            </Link>

            <Link to="/leaderboard" className="card flex items-center gap-3 hover:shadow-md transition-all group cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0">
                <Trophy size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-yellow-600 transition-colors">Leaderboard</p>
                <p className="text-xs text-gray-400">See the top students</p>
              </div>
            </Link>

            <Link to="/practice" className="card flex items-center gap-3 hover:shadow-md transition-all group cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <Zap size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">Browse All</p>
                <p className="text-xs text-gray-400">All dictation levels</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent history */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Practice Sessions</h2>
            <Link to="/history" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          <HistoryTable history={history || []} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard
