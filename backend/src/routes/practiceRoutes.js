const express = require('express');
const {
  submitPractice,
  getMyHistory,
  getMyStats,
  getLeaderboard,
  getStudentHistory,
} = require('../controllers/practiceController');
const { protect } = require('../middleware/authMiddleware');
const { isRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/leaderboard', getLeaderboard);
router.post('/submit', isRole('student'), submitPractice);
router.get('/history', isRole('student'), getMyHistory);
router.get('/stats', isRole('student'), getMyStats);
router.get('/student/:studentId', isRole('teacher', 'admin'), getStudentHistory);

module.exports = router;
