import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { loginUser } from '../../features/auth/authSlice'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/dashboard' }
      navigate(redirectMap[user.role] || '/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  const onSubmit = (data) => dispatch(loginUser(data))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur mb-4 overflow-hidden">
            <img src="/logo.png" alt="Lucent Shorthand Classes" className="h-14 w-14 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white">Lucent Shorthand Classes</h1>
          <p className="text-purple-200 mt-1">Stenography Practice Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Welcome back</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              <div className="text-right mt-1.5">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Student accounts are created by your teacher.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
