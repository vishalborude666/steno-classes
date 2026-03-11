import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Upload, FileText, Users, UserPlus, Download, BarChart2 } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatsCard from '../../components/dashboard/StatsCard'
import api from '../../services/axiosInstance'

const TeacherDashboard = () => {
  const { user } = useSelector((state) => state.auth)

  const quickLinks = [
    { to: '/teacher/upload', icon: Upload, label: 'Upload Dictation', desc: 'Add new audio or YouTube content', color: 'blue' },
    { to: '/teacher/content', icon: FileText, label: 'Manage Content', desc: 'View and edit your uploads', color: 'green' },
    { to: '/teacher/students', icon: UserPlus, label: 'Manage Students', desc: 'Create and manage student accounts', color: 'purple' },
    { to: '/teacher/reports', icon: Users, label: 'Student Reports', desc: 'Track student performance', color: 'amber' },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="card bg-gradient-to-r from-primary-700 to-primary-900 text-white">
          <p className="text-purple-200 text-sm mb-1">Teacher Dashboard</p>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-purple-200 text-sm mt-1">Manage your dictations and track student progress</p>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="card hover:shadow-md transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
                <Icon size={22} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TeacherDashboard
