import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, IndianRupee, CheckCircle } from 'lucide-react'
import { fetchCourses } from '../../features/course/courseSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'

const CoursesPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courses, loading } = useSelector((state) => state.course)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paid Courses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse premium courses and enhance your stenography skills</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : courses.length === 0 ? (
          <div className="card text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No courses available yet</p>
            <p className="text-sm mt-1">Check back later for premium content.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/student/courses/${c._id}`)}
                  className="card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                >
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-800 transition-colors">
                      <BookOpen size={40} className="text-white/60" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {c.title}
                    </h3>
                    {c.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{c.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Users size={14} /> {c.enrollmentCount || 0}</span>
                      </div>
                      {c.isEnrolled ? (
                        <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                          <CheckCircle size={16} /> Enrolled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
                          <IndianRupee size={14} /> {c.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CoursesPage
