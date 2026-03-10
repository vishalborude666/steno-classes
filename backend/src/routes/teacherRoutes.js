const express = require('express');
const { body } = require('express-validator');
const { createStudent, toggleStudentStatus, getAllStudents, getMyDictations, getMyStudents, getStudentReport, exportExcel } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { isRole } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect, isRole('teacher', 'admin'));

// Student account management
router.post(
  '/create-student',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  createStudent
);
router.get('/all-students', getAllStudents);
router.patch('/students/:studentId/toggle-status', toggleStudentStatus);

router.get('/dictations', getMyDictations);
router.get('/students', getMyStudents);
router.get('/students/:studentId/report', getStudentReport);
router.get('/export/excel', exportExcel);

module.exports = router;
