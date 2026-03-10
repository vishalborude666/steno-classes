import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, Mail, ArrowLeft } from 'lucide-react'
import { forgotPassword } from '../../features/auth/authSlice'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    const res = await dispatch(forgotPassword({ email }))
    if (forgotPassword.fulfilled.match(res)) setSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Lucent Shorthand Classes</h1>
          <p className="text-blue-200 mt-1">Reset your password</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>. The link expires in 15 minutes.
              </p>
              <Link to="/login" className="btn-primary w-full inline-block text-center">Back to Login</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Enter your registered email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:underline inline-flex items-center gap-1">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
