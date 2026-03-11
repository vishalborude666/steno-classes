export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',

  // Student
  STUDENT_DASHBOARD: '/dashboard',
  PRACTICE: '/practice',
  AI_DICTATION: '/ai-dictation',
  PRACTICE_EDITOR: '/practice/:id',
  HISTORY: '/history',
  LEADERBOARD: '/leaderboard',
  DAILY_CHALLENGE: '/daily-challenge',
  LEARNING_VIDEOS: '/lectures',
  COURSES: '/student/courses',
  COURSE_PLAYER: '/student/courses/:id',

  // Teacher
  TEACHER_DASHBOARD: '/teacher',
  UPLOAD_DICTATION: '/teacher/upload',
  MANAGE_CONTENT: '/teacher/content',
  MANAGE_STUDENTS: '/teacher/students',
  STUDENT_REPORTS: '/teacher/reports',
  MANAGE_LEARNING_VIDEOS: '/teacher/videos',
  MANAGE_COURSES: '/teacher/courses',
  COURSE_DETAIL: '/teacher/courses/:id',
  COURSE_ANALYTICS: '/teacher/courses/:id/analytics',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  USER_MANAGEMENT: '/admin/users',
  CONTENT_MODERATION: '/admin/content',
  ANALYTICS: '/admin/analytics',
}
