import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const handleLogout = () => dispatch(logout())

  return { user, isAuthenticated, loading, error, logout: handleLogout }
}
