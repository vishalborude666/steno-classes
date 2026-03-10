import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeaderboard } from '../../features/practice/practiceSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import LeaderboardTable from '../../components/dashboard/LeaderboardTable'
import Loader from '../../components/common/Loader'
import { Trophy } from 'lucide-react'

const LeaderboardPage = () => {
  const dispatch = useDispatch()
  const { leaderboard, loading } = useSelector((state) => state.practice)

  useEffect(() => {
    dispatch(fetchLeaderboard())
  }, [dispatch])

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
            <Trophy size={20} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
            <p className="text-gray-500 text-sm">Top 20 students by average WPM</p>
          </div>
        </div>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : (
            <LeaderboardTable data={leaderboard} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LeaderboardPage
