import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Trash2, Edit, Plus, X, BookOpen, Users, IndianRupee, Eye } from 'lucide-react'
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../../features/course/courseSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const emptyForm = { title: '', description: '', price: '' }

const ManageCoursesPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courses, loading } = useSelector((state) => state.course)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [thumbnail, setThumbnail] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyForm)
    setThumbnail(null)
    setShowModal(true)
  }

  const openEdit = (c) => {
    setEditItem(c)
    setForm({ title: c.title, description: c.description || '', price: c.price })
    setThumbnail(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditItem(null)
    setForm(emptyForm)
    setThumbnail(null)
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price) return toast.error('Title and price are required')
    if (Number(form.price) < 0) return toast.error('Price must be a positive number')

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('description', form.description.trim())
    fd.append('price', form.price)
    if (thumbnail) fd.append('thumbnail', thumbnail)

    setSubmitting(true)
    try {
      if (editItem) {
        await dispatch(updateCourse({ id: editItem._id, formData: fd })).unwrap()
      } else {
        await dispatch(createCourse(fd)).unwrap()
      }
      closeModal()
    } catch {
      // toast handled in slice
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this course and all its lessons? This cannot be undone.')) {
      dispatch(deleteCourse(id))
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Course
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No courses yet</p>
              <p className="text-sm mt-1">Create your first paid course to start earning.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c) => (
                <div key={c._id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <BookOpen size={40} className="text-white/60" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{c.title}</h3>
                    {c.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{c.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><IndianRupee size={14} /> {c.price}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {c.enrollmentCount || 0}</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/teacher/courses/${c._id}`)}
                          className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View & Manage Lessons"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editItem ? 'Edit Course' : 'Create Course'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. Advanced Shorthand Mastery" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (INR) *</label>
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="price" type="number" min="0" step="1" value={form.price} onChange={handleChange} className="input-field pl-10" placeholder="499" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="What students will learn..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
                  <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="input-field text-sm" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                    {submitting ? 'Saving...' : editItem ? 'Save Changes' : 'Create Course'}
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

export default ManageCoursesPage
