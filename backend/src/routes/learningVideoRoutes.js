const express = require('express');
const {
  getLearningVideos,
  createLearningVideo,
  updateLearningVideo,
  deleteLearningVideo,
} = require('../controllers/learningVideoController');
const { protect } = require('../middleware/authMiddleware');
const { isRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getLearningVideos);
router.post('/', isRole('teacher', 'admin'), createLearningVideo);
router.put('/:id', isRole('teacher', 'admin'), updateLearningVideo);
router.delete('/:id', isRole('teacher', 'admin'), deleteLearningVideo);

module.exports = router;
