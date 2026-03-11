import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Lock, CheckCircle, IndianRupee, Users, Video } from 'lucide-react'
import {
  fetchCourse,
  createOrder,
  verifyPayment,
  clearCurrentCourse,
  clearOrderData,
} from '../../features/course/courseSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

const CoursePlayerPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentCourse, orderData, loading } = useSelector((state) => state.course)
  const { user } = useSelector((state) => state.auth)
  const [activeLesson, setActiveLesson] = useState(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    dispatch(fetchCourse(id))
    return () => {
      dispatch(clearCurrentCourse())
      dispatch(clearOrderData())
    }
  }, [dispatch, id])

  const course = currentCourse?.course
  const lessons = currentCourse?.lessons || []
  const isEnrolled = currentCourse?.course?.isEnrolled

  // Set first lesson as active when loaded and enrolled
  useEffect(() => {
    if (isEnrolled && lessons.length > 0 && !activeLesson) {
      const sorted = [...lessons].sort((a, b) => a.order - b.order)
      setActiveLesson(sorted[0])
    }
  }, [isEnrolled, lessons, activeLesson])

  const handlePayment = useCallback(async () => {
    setPaying(true)
    try {
      const result = await dispatch(createOrder(id)).unwrap()
      
      const options = {
        key: result.keyId,
        amount: result.amount,
        currency: result.currency,
        name: 'Steno Courses',
        description: result.courseTitle,
        order_id: result.orderId,
        handler: async (response) => {
          await dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: id,
          })).unwrap()
          // Re-fetch course to get video URLs
          dispatch(fetchCourse(id))
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8A2BE2',
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + (response.error?.description || 'Unknown error'))
        setPaying(false)
      })
      razorpay.open()
    } catch {
      setPaying(false)
    }
  }, [dispatch, id, user])

  if (loading || !course) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader /></div>
      </DashboardLayout>
    )
  }

  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order)

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/student/courses')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 truncate">{course.title}</h1>
          {isEnrolled && (
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 flex-shrink-0">
              <CheckCircle size={16} /> Enrolled
            </span>
          )}
        </div>

        {!isEnrolled ? (
          /* Purchase View */
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover rounded-xl" />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <Video size={60} className="text-white/40" />
                </div>
              )}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About this course</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{course.description || 'No description provided.'}</p>
              </div>
              {/* Lesson List (locked) */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Course Content ({sortedLessons.length} lessons)</h3>
                <div className="card divide-y divide-gray-100 dark:divide-gray-700">
                  {sortedLessons.map((l, idx) => (
                    <div key={l._id} className="flex items-center gap-3 p-3 text-gray-400">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold">{idx + 1}</div>
                      <span className="flex-1 text-sm">{l.title}</span>
                      {l.duration && <span className="text-xs">{l.duration} min</span>}
                      <Lock size={14} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Purchase Card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <div className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-1 mb-4">
                  <IndianRupee size={28} /> {course.price}
                </div>
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="btn-primary w-full py-3 text-base disabled:opacity-50"
                >
                  {paying ? 'Processing...' : 'Enroll Now'}
                </button>
                <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <p className="flex items-center gap-2"><Video size={14} /> {sortedLessons.length} video lessons</p>
                  <p className="flex items-center gap-2"><Users size={14} /> {course.enrollmentCount || 0} students enrolled</p>
                  <p className="flex items-center gap-2"><CheckCircle size={14} /> Lifetime access</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Player View */
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeLesson?.videoUrl ? (
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                  <video
                    key={activeLesson._id}
                    src={activeLesson.videoUrl}
                    controls
                    className="w-full h-full"
                    controlsList="nodownload"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
                  <p className="text-gray-400">Select a lesson to start watching</p>
                </div>
              )}
              {activeLesson && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{activeLesson.title}</h2>
                  {activeLesson.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeLesson.description}</p>
                  )}
                </div>
              )}
            </div>
            {/* Lesson Sidebar */}
            <div className="lg:col-span-1">
              <div className="card divide-y divide-gray-100 dark:divide-gray-700 max-h-[70vh] overflow-y-auto">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Lessons ({sortedLessons.length})</h3>
                </div>
                {sortedLessons.map((l, idx) => (
                  <button
                    key={l._id}
                    onClick={() => setActiveLesson(l)}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      activeLesson?._id === l._id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      activeLesson?._id === l._id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {activeLesson?._id === l._id ? <Play size={12} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${activeLesson?._id === l._id ? 'font-medium text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {l.title}
                      </p>
                      {l.duration && <span className="text-xs text-gray-400">{l.duration} min</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CoursePlayerPage
