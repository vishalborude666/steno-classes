import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { registerUser } from '../../features/auth/authSlice'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'student' } })

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/dashboard' }
      navigate(redirectMap[user.role] || '/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  const onSubmit = (data) => dispatch(registerUser(data))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Lucent Shorthand Classes</h1>
          <p className="text-purple-200 mt-1">Create your account</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get started</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="John Doe"
                  className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                  {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['student', 'teacher'].map((r) => (
                  <label key={r} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    watch('role') === r
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}>
                    <input type="radio" value={r} {...register('role')} className="sr-only" />
                    <span className="font-semibold capitalize text-sm">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
