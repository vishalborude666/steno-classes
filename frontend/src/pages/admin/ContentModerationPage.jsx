import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ToggleLeft, ToggleRight, Trash2, ShieldCheck } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { formatDate, capitalize } from '../../utils/formatters'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

const ContentModerationPage = () => {
  const [dictations, setDictations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dictations')
      .then((r) => setDictations(r.data.data.dictations))
      .catch(() => toast.error('Failed to load dictations'))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (id) => {
    try {
      const r = await api.put(`/admin/dictations/${id}/toggle`)
      setDictations((prev) => prev.map((d) => d._id === id ? r.data.data.dictation : d))
    } catch {
      toast.error('Failed to toggle dictation')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this dictation?')) return
    try {
      await api.delete(`/dictations/${id}`)
      setDictations((prev) => prev.filter((d) => d._id !== id))
      toast.success('Dictation deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const badgeClass = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <ShieldCheck size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
        </div>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Title', 'Uploaded By', 'Difficulty', 'Practices', 'Status', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {dictations.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{d.title}</p>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{d.uploadedBy?.name}</td>
                      <td className="py-3 px-3"><span className={badgeClass[d.difficulty]}>{d.difficulty}</span></td>
                      <td className="py-3 px-3 text-gray-500">{d.practiceCount || 0}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-semibold ${d.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                          {d.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{formatDate(d.createdAt)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleToggle(d._id)}
                            className={`p-1.5 rounded-lg transition-colors ${d.isActive
                              ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                              : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            }`} title={d.isActive ? 'Hide' : 'Show'}>
                            {d.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                          <button onClick={() => handleDelete(d._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dictations.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">No dictations found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ContentModerationPage
