import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, Edit, Youtube, Plus, X } from 'lucide-react'
import {
  fetchLearningVideos,
  createLearningVideo,
  updateLearningVideo,
  deleteLearningVideo,
} from '../../features/learningVideo/learningVideoSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const getYouTubeId = (url) => url?.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] || ''

const emptyForm = { title: '', description: '', youtubeLink: '' }

const ManageLearningVideosPage = () => {
  const dispatch = useDispatch()
  const { videos, loading } = useSelector((state) => state.learningVideo)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchLearningVideos({ limit: 100 }))
  }, [dispatch])

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (v) => {
    setEditItem(v)
    setForm({ title: v.title, description: v.description || '', youtubeLink: v.youtubeLink })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditItem(null)
    setForm(emptyForm)
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.youtubeLink.trim()) {
      return toast.error('Title and YouTube link are required')
    }
    if (editItem) {
      await dispatch(updateLearningVideo({ id: editItem._id, payload: form }))
    } else {
      await dispatch(createLearningVideo(form))
    }
    closeModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this video? This cannot be undone.')) {
      dispatch(deleteLearningVideo(id))
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Videos</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Video
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Youtube size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No learning videos added yet</p>
              <p className="text-sm mt-1">Click "Add Video" to share a YouTube lecture with your students.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((v) => {
                const videoId = getYouTubeId(v.youtubeLink)
                return (
                  <div key={v._id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group">
                    <div className="relative">
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt={v.title}
                        className="w-full aspect-video object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">{v.title}</h3>
                      {v.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{v.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-400">{formatDate(v.createdAt)}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(v)}
                            className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editItem ? 'Edit Video' : 'Add Learning Video'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. How to Write Shorthand Outlines" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube Link *</label>
                  <div className="relative">
                    <Youtube size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                    <input name="youtubeLink" value={form.youtubeLink} onChange={handleChange} className="input-field pl-10" placeholder="https://www.youtube.com/watch?v=..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Brief description of the video..." />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="btn-primary">{editItem ? 'Save Changes' : 'Add Video'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageLearningVideosPage
