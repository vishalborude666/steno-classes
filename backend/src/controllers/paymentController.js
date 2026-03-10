const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) return sendError(res, 404, 'Course not found');

    // Check if already enrolled
    const existing = await Enrollment.findOne({ studentId: req.user._id, courseId, status: 'success' });
    if (existing) return sendError(res, 400, 'Already enrolled in this course');

    const options = {
      amount: Math.round(course.price * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        courseId: courseId.toString(),
        studentId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    sendSuccess(res, 200, 'Order created', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.title,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment & enroll
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return sendError(res, 400, 'Missing payment details');
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return sendError(res, 400, 'Payment verification failed');
    }

    const course = await Course.findById(courseId);
    if (!course) return sendError(res, 404, 'Course not found');

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: course.price,
      status: 'success',
    });

    // Increment enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    sendSuccess(res, 200, 'Payment verified, enrolled successfully', { enrollment });
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 400, 'Already enrolled in this course');
    }
    next(error);
  }
};

// Get student's enrollments
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id, status: 'success' })
      .populate('courseId', 'title description price thumbnail')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Enrollments fetched', { enrollments });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, getMyEnrollments };
