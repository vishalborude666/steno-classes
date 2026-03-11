const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateDictation, submitAIPractice, getTopics } = require('../controllers/aiDictationController');

router.use(protect);

router.get('/topics', getTopics);
router.post('/generate', generateDictation);
router.post('/submit', submitAIPractice);

module.exports = router;
