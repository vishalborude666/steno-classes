const express = require('express');
const {
  getDictations,
  getDictation,
  createDictation,
  updateDictation,
  deleteDictation,
  getDailyChallenge,
} = require('../controllers/dictationController');
const { protect } = require('../middleware/authMiddleware');
const { isRole } = require('../middleware/roleMiddleware');
const { uploadAudio } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/daily-challenge', getDailyChallenge);
router.get('/', getDictations);
router.get('/:id', getDictation);
router.post('/', isRole('teacher', 'admin'), uploadAudio, createDictation);
router.put('/:id', isRole('teacher', 'admin'), uploadAudio, updateDictation);
router.delete('/:id', isRole('admin'), deleteDictation);

module.exports = router;
