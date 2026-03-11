import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initDarkMode } from './features/ui/uiSlice'
import { fetchMe } from './features/auth/authSlice'
import ProtectedRoute from './components/common/ProtectedRoute'
import RoleRoute from './components/common/RoleRoute'
import Loader from './components/common/Loader'

// Pages - Public
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage'
import ResetPasswordPage from './pages/public/ResetPasswordPage'
import NotFoundPage from './pages/public/NotFoundPage'

// Pages - Student
import StudentDashboard from './pages/student/StudentDashboard'
import PracticePage from './pages/student/PracticePage'
import PracticeEditorPage from './pages/student/PracticeEditorPage'
import PracticeHistoryPage from './pages/student/PracticeHistoryPage'
import LeaderboardPage from './pages/student/LeaderboardPage'
import DailyChallengePage from './pages/student/DailyChallengePage'
import LearningVideosPage from './pages/student/LectureVideosPage'
import CoursesPage from './pages/student/CoursesPage'
import CoursePlayerPage from './pages/student/CoursePlayerPage'
import AIDictationPage from './pages/student/AIDictationPage'

// Pages - Teacher
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import UploadDictationPage from './pages/teacher/UploadDictationPage'
import ManageContentPage from './pages/teacher/ManageContentPage'
import ManageStudentsPage from './pages/teacher/ManageStudentsPage'
import StudentReportsPage from './pages/teacher/StudentReportsPage'
import ManageLearningVideosPage from './pages/teacher/ManageLearningVideosPage'
import ManageCoursesPage from './pages/teacher/ManageCoursesPage'
import CourseDetailPage from './pages/teacher/CourseDetailPage'
import CourseAnalyticsPage from './pages/teacher/CourseAnalyticsPage'

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'
import ContentModerationPage from './pages/admin/ContentModerationPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'

function App() {
  const dispatch = useDispatch()
  const { token, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(initDarkMode())
    if (token) dispatch(fetchMe())
  }, [dispatch, token])

  if (loading) return <Loader fullPage />

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Student routes */}
        <Route path="/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={['student']}><StudentDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
        <Route path="/practice/:id" element={<ProtectedRoute><PracticeEditorPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><RoleRoute allowedRoles={['student']}><PracticeHistoryPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/daily-challenge" element={<ProtectedRoute><DailyChallengePage /></ProtectedRoute>} />
        <Route path="/lectures" element={<ProtectedRoute><LearningVideosPage /></ProtectedRoute>} />
        <Route path="/ai-dictation" element={<ProtectedRoute><AIDictationPage /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute><RoleRoute allowedRoles={['student']}><CoursesPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/student/courses/:id" element={<ProtectedRoute><RoleRoute allowedRoles={['student']}><CoursePlayerPage /></RoleRoute></ProtectedRoute>} />

        {/* Teacher routes */}
        <Route path="/teacher" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/upload" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><UploadDictationPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/content" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><ManageContentPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/students" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><ManageStudentsPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/reports" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><StudentReportsPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/videos" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><ManageLearningVideosPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/courses" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><ManageCoursesPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/courses/:id" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><CourseDetailPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/teacher/courses/:id/analytics" element={<ProtectedRoute><RoleRoute allowedRoles={['teacher', 'admin']}><CourseAnalyticsPage /></RoleRoute></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><UserManagementPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><ContentModerationPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AnalyticsPage /></RoleRoute></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
