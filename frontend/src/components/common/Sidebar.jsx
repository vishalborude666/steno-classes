import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  LayoutDashboard, Mic, History, Trophy, Calendar,
  Upload, FileText, Users, Settings, BarChart3, ShieldCheck, LogOut, X, Youtube, BookOpen, Sparkles, Type
} from 'lucide-react'
import { logout } from '../../features/auth/authSlice'

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/practice', icon: Mic, label: 'Practice' },
  { to: '/marathi-practice', icon: Type, label: 'मराठी सराव' },
  { to: '/ai-dictation', icon: Sparkles, label: 'AI Dictation' },
  { to: '/daily-challenge', icon: Calendar, label: 'Daily Challenge' },
  { to: '/history', icon: History, label: 'My History' },
  { to: '/lectures', icon: Youtube, label: 'Learning Videos' },
  { to: '/student/courses', icon: BookOpen, label: 'Paid Courses' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
]

const teacherLinks = [
  { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/upload', icon: Upload, label: 'Upload Dictation' },
  { to: '/teacher/content', icon: FileText, label: 'My Content' },
  { to: '/teacher/students', icon: Users, label: 'Manage Students' },
  { to: '/teacher/reports', icon: Users, label: 'Student Reports' },
  { to: '/teacher/videos', icon: Youtube, label: 'Learning Videos' },
  { to: '/teacher/courses', icon: BookOpen, label: 'Paid Courses' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
]

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/content', icon: ShieldCheck, label: 'Content Moderation' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/teacher', icon: Upload, label: 'Teacher Tools' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
]

const roleLinks = { student: studentLinks, teacher: teacherLinks, admin: adminLinks }

const Sidebar = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth)
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const links = roleLinks[user?.role] || studentLinks

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-gradient-to-b from-primary-900 to-primary-950
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Lucent Shorthand Classes" className="h-10 w-10 rounded-lg flex-shrink-0" />
            <span className="text-white font-bold text-sm leading-tight">Lucent Shorthand<br />Classes</span>
          </div>
          <button onClick={onClose} className="md:hidden text-purple-200 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-sm truncate max-w-[140px]">{user?.name}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/teacher' || to === '/admin'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-300 hover:text-red-200 hover:bg-red-900/20"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
