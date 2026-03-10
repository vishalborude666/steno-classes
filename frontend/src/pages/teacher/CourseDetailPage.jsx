import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2, Edit, Plus, X, ArrowLeft, Video, GripVertical, BarChart3 } from 'lucide-react'
import {
  fetchCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  clearCurrentCourse,
} from '../../features/course/courseSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

const emptyLessonForm = { title: '', description: '', duration: '' }

const CourseDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentCourse, loading } = useSelector((state) => state.course)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyLessonForm)
  const [videoFile, setVideoFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchCourse(id))
    return () => dispatch(clearCurrentCourse())
  }, [dispatch, id])

  const course = currentCourse?.course
  const lessons = currentCourse?.lessons || []

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyLessonForm)
    setVideoFile(null)
    setShowModal(true)
  }

  const openEdit = (l) => {
    setEditItem(l)
    setForm({ title: l.title, description: l.description || '', duration: l.duration || '' })
    setVideoFile(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditItem(null)
    setForm(emptyLessonForm)
    setVideoFile(null)
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Lesson title is required')
    if (!editItem && !videoFile) return toast.error('Video file is required for new lesson')

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('description', form.description.trim())
    if (form.duration) fd.append('duration', form.duration)
    fd.append('order', editItem ? editItem.order : lessons.length + 1)
    if (videoFile) fd.append('video', videoFile)

    setSubmitting(true)
    try {
      if (editItem) {
        await dispatch(updateLesson({ courseId: id, lessonId: editItem._id, formData: fd })).unwrap()
      } else {
        await dispatch(addLesson({ courseId: id, formData: fd })).unwrap()
      }
      closeModal()
    } catch {
      // handled in slice
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Delete this lesson? This cannot be undone.')) {
      dispatch(deleteLesson({ courseId: id, lessonId }))
    }
  }

  if (loading || !course) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader /></div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/teacher/courses')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} &middot; {course.enrollmentCount || 0} enrolled
            </p>
          </div>
          <button
            onClick={() => navigate(`/teacher/courses/${id}/analytics`)}
            className="btn-secondary flex items-center gap-2"
          >
            <BarChart3 size={16} /> Analytics
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Lesson
          </button>
        </div>

        {/* Lessons List */}
        <div className="card divide-y divide-gray-100 dark:divide-gray-700">
          {lessons.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Video size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No lessons yet</p>
              <p className="text-sm mt-1">Add your first video lesson to this course.</p>
            </div>
          ) : (
            lessons
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((l, idx) => (
                <div key={l._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="text-gray-300 dark:text-gray-600">
                    <GripVertical size={18} />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{l.title}</h3>
                    {l.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{l.description}</p>
                    )}
                  </div>
                  {l.duration && (
                    <span className="text-xs text-gray-400 flex-shrink-0">{l.duration} min</span>
                  )}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(l)}
                      className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(l._id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Add / Edit Lesson Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editItem ? 'Edit Lesson' : 'Add Lesson'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lesson Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. Introduction to Pitman Shorthand" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="What this lesson covers..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                  <input name="duration" type="number" min="0" value={form.duration} onChange={handleChange} className="input-field" placeholder="15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Video File {editItem ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="input-field text-sm" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                    {submitting ? 'Uploading...' : editItem ? 'Save Changes' : 'Add Lesson'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CourseDetailPage
