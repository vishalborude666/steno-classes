const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  getCourseAnalytics,
} = require('../controllers/courseController');
const { createOrder, verifyPayment, getMyEnrollments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { isRole } = require('../middleware/roleMiddleware');
const { uploadVideo, uploadThumbnail } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

// Public (authenticated) routes
router.get('/', getCourses);
router.get('/my-enrollments', getMyEnrollments);
router.get('/:id', getCourse);

// Payment routes (students)
router.post('/payment/create-order', isRole('student'), createOrder);
router.post('/payment/verify', isRole('student'), verifyPayment);

// Teacher/Admin routes - courses
router.post('/', isRole('teacher', 'admin'), uploadThumbnail, createCourse);
router.put('/:id', isRole('teacher', 'admin'), uploadThumbnail, updateCourse);
router.delete('/:id', isRole('teacher', 'admin'), deleteCourse);

// Teacher/Admin routes - lessons
router.post('/:courseId/lessons', isRole('teacher', 'admin'), uploadVideo, addLesson);
router.put('/:courseId/lessons/:lessonId', isRole('teacher', 'admin'), uploadVideo, updateLesson);
router.delete('/:courseId/lessons/:lessonId', isRole('teacher', 'admin'), deleteLesson);

// Analytics
router.get('/:id/analytics', isRole('teacher', 'admin'), getCourseAnalytics);

module.exports = router;
