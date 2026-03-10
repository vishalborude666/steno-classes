import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, IndianRupee, Users, TrendingUp, BookOpen } from 'lucide-react'
import { fetchCourseAnalytics } from '../../features/course/courseSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/formatters'

const CourseAnalyticsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { analytics, loading } = useSelector((state) => state.course)

  useEffect(() => {
    dispatch(fetchCourseAnalytics(id))
  }, [dispatch, id])

  if (loading || !analytics) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader /></div>
      </DashboardLayout>
    )
  }

  const { course, totalRevenue, totalStudents, enrollments } = analytics

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/teacher/courses/${id}`)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Analytics</h1>
        </div>

        {/* Course Info */}
        <div className="card p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.description}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <IndianRupee size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{'\u20B9'}{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Course Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{'\u20B9'}{course.price}</p>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="card">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Payment History</h3>
          </div>
          {enrollments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>No enrollments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                    <th className="p-4 font-medium">Student</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Payment ID</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e._id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="p-4 text-gray-900 dark:text-white">{e.studentId?.name || 'Unknown'}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{'\u20B9'}{e.amount}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{e.razorpayPaymentId || '-'}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          e.status === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : e.status === 'failed'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(e.createdAt)}</td>
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

export default CourseAnalyticsPage
