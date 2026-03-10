import { useEffect, useState } from 'react'
import { UserPlus, Users, ToggleLeft, ToggleRight, Mail, Lock, User } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'
import { formatDate } from '../../utils/formatters'
import { getWPMColor, getAccuracyColor } from '../../utils/formatters'

const ManageStudentsPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const fetchStudents = () => {
    setLoading(true)
    api.get('/teacher/all-students')
      .then((r) => setStudents(r.data.data.students))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStudents() }, [])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('All fields are required')
      return
    }
    setCreating(true)
    try {
      const { data } = await api.post('/teacher/create-student', form)
      toast.success('Student account created!')
      setStudents((prev) => [{ ...data.data.student, avgWpm: 0, avgAccuracy: 0, totalSessions: 0 }, ...prev])
      setForm({ name: '', email: '', password: '' })
      setShowForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create student')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (studentId) => {
    try {
      const { data } = await api.patch(`/teacher/students/${studentId}/toggle-status`)
      setStudents((prev) =>
        prev.map((s) => s._id === studentId ? { ...s, isActive: data.data.student.isActive } : s)
      )
      toast.success(data.message)
    } catch {
      toast.error('Failed to update student status')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Students</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Create and manage student accounts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={18} />
            {showForm ? 'Cancel' : 'Add Student'}
          </button>
        </div>

        {/* Create Student Form */}
        {showForm && (
          <div className="card mb-6 border-2 border-primary-200 dark:border-primary-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Create Student Account</h2>
            <form onSubmit={handleCreate} className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="password"
                    type="text"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="input-field pl-9"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <button type="submit" disabled={creating} className="btn-primary flex items-center gap-2">
                  {creating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Create Account
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-2">A welcome email with credentials will be sent to the student.</p>
              </div>
            </form>
          </div>
        )}

        {/* Students Table */}
        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No students yet</p>
              <p className="text-sm mt-1">Click "Add Student" to create student accounts</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Student', 'Email', 'Status', 'Avg WPM', 'Avg Accuracy', 'Sessions', 'Joined', ''].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs">
                            {s.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-500">{s.email}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          s.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={`py-3 px-3 font-bold ${getWPMColor(s.avgWpm)}`}>{s.avgWpm}</td>
                      <td className={`py-3 px-3 font-bold ${getAccuracyColor(s.avgAccuracy)}`}>{s.avgAccuracy}%</td>
                      <td className="py-3 px-3 text-gray-500">{s.totalSessions}</td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{formatDate(s.createdAt)}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggle(s._id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            s.isActive
                              ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                              : 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                          title={s.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {s.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageStudentsPage
