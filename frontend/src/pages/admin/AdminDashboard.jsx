import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Users, ShieldCheck, BarChart3, BookOpen, Mic, Activity } from 'lucide-react'
import { fetchAnalytics } from '../../features/user/userSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatsCard from '../../components/dashboard/StatsCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Loader from '../../components/common/Loader'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { analytics, dailyActivity, loading } = useSelector((state) => state.user)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchAnalytics())
  }, [dispatch])

  const quickLinks = [
    { to: '/admin/users', icon: Users, label: 'User Management', desc: 'Manage students, teachers, admins' },
    { to: '/admin/content', icon: ShieldCheck, label: 'Content Moderation', desc: 'Review and moderate all dictations' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', desc: 'Platform-wide statistics' },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="card bg-gradient-to-r from-primary-700 to-primary-900 text-white">
          <p className="text-purple-200 text-sm mb-1">Admin Panel</p>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-purple-200 text-sm mt-1">Full platform control and analytics</p>
        </div>

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={Users} label="Total Users" value={analytics.totalUsers} color="blue" />
            <StatsCard icon={BookOpen} label="Total Practices" value={analytics.totalPractices} color="green" />
            <StatsCard icon={Mic} label="Dictations" value={analytics.totalDictations} color="amber" />
            <StatsCard icon={Activity} label="Platform Avg WPM" value={analytics.avgWpm} color="purple" />
          </div>
        )}

        {/* Activity chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Last 7 Days Activity</h2>
          {dailyActivity?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyActivity} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to} className="card hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
                <Icon size={22} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{label}</h3>
              <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
