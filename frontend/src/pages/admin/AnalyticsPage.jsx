import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users, BookOpen, Mic, Activity, Target, Zap } from 'lucide-react'
import { fetchAnalytics } from '../../features/user/userSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatsCard from '../../components/dashboard/StatsCard'
import Loader from '../../components/common/Loader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

const AnalyticsPage = () => {
  const dispatch = useDispatch()
  const { analytics, dailyActivity, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchAnalytics())
  }, [dispatch])

  if (loading && !analytics) {
    return <DashboardLayout><div className="flex justify-center py-20"><Loader size="lg" /></div></DashboardLayout>
  }

  const roleData = analytics ? [
    { name: 'Students', count: analytics.totalStudents },
    { name: 'Teachers', count: analytics.totalTeachers },
    { name: 'Admins', count: analytics.totalUsers - analytics.totalStudents - analytics.totalTeachers },
  ] : []

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>

        {analytics && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatsCard icon={Users} label="Total Users" value={analytics.totalUsers} color="blue" />
              <StatsCard icon={BookOpen} label="Total Practices" value={analytics.totalPractices} color="green" />
              <StatsCard icon={Mic} label="Active Dictations" value={analytics.totalDictations} color="amber" />
              <StatsCard icon={Activity} label="Platform Avg WPM" value={analytics.avgWpm} color="purple" />
              <StatsCard icon={Target} label="Platform Avg Accuracy" value={`${analytics.avgAccuracy}%`} color="green" />
              <StatsCard icon={Zap} label="Teachers" value={analytics.totalTeachers} color="amber" />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Daily activity */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Practice Sessions (Last 7 Days)</h2>
                {dailyActivity?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#411287', border: 'none', borderRadius: '10px', color: '#fff' }} />
                      <Bar dataKey="count" fill="#9B3DE8" radius={[6, 6, 0, 0]} name="Sessions" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-400 py-8 text-sm">No activity data yet</p>
                )}
              </div>

              {/* User distribution */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={roleData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#411287', border: 'none', borderRadius: '10px', color: '#fff' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage
