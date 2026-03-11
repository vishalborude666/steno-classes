import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Moon, Sun, Menu, LogOut, User } from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { toggleDarkMode, toggleSidebar } from '../../features/ui/uiSlice'

const Navbar = ({ showSidebarToggle = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const darkMode = useSelector((state) => state.ui.darkMode)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-primary-700 dark:text-primary-400">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              S
            </div>
            <span className="hidden sm:inline text-base">Lucent Shorthand Classes</span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                <div className="h-7 w-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 leading-none">{user?.name}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Login</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
