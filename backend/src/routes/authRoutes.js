const express = require('express');
const { body } = require('express-validator');
const { login, getMe, updateProfile, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// Public registration removed — only the teacher can create student accounts

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

// Forgot password — request reset link
router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required'),
  ],
  validate,
  forgotPassword
);

// Reset password — set new password using token
router.post(
  '/reset-password/:token',
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
