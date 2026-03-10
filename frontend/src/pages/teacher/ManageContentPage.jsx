import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, Edit, FileText, X } from 'lucide-react'
import { fetchDictations, deleteDictation, updateDictation } from '../../features/dictation/dictationSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/formatters'

const ManageContentPage = () => {
  const dispatch = useDispatch()
  const { dictations, loading } = useSelector((state) => state.dictation)
  const { user } = useSelector((state) => state.auth)
  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', difficulty: 'medium' })

  const myDictations = dictations.filter(
    (d) => d.uploadedBy?._id === user?._id || d.uploadedBy === user?._id
  )

  useEffect(() => {
    dispatch(fetchDictations({ limit: 100 }))
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Delete this dictation? This cannot be undone.')) {
      dispatch(deleteDictation(id))
    }
  }

  const openEdit = (d) => {
    setEditItem(d)
    setEditForm({ title: d.title, description: d.description || '', difficulty: d.difficulty })
  }

  const handleEditChange = (e) => setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(editForm).forEach(([k, v]) => formData.append(k, v))
    await dispatch(updateDictation({ id: editItem._id, formData }))
    setEditItem(null)
  }

  const badgeClass = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Content</h1>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : myDictations.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No dictations uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Title', 'Difficulty', 'Practices', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {myDictations.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[220px]">{d.title}</p>
                        {d.audioUrl && <span className="text-xs text-primary-500">Audio</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className={badgeClass[d.difficulty]}>{d.difficulty}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-500">{d.practiceCount || 0}</td>
                      <td className="py-3 px-3 text-gray-400">{formatDate(d.createdAt)}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => openEdit(d)}
                          className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors mr-1"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(d._id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Dictation</h2>
                <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={2} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select name="difficulty" value={editForm.difficulty} onChange={handleEditChange} className="input-field w-40">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageContentPage
