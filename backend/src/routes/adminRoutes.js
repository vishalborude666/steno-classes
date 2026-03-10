const express = require('express');
const {
  getAllUsers,
  updateUserRole,
  toggleUserActive,
  deleteUser,
  getAnalytics,
  getAllDictations,
  toggleDictationActive,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, isRole('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle', toggleUserActive);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);
router.get('/dictations', getAllDictations);
router.put('/dictations/:id/toggle', toggleDictationActive);

module.exports = router;
