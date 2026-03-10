const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const cloudinary = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── Public / Student ───

const getCourses = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(filter),
    ]);

    // If student, attach enrollment status
    let enrolledCourseIds = [];
    if (req.user && req.user.role === 'student') {
      const enrollments = await Enrollment.find({ studentId: req.user._id, status: 'success' }).select('courseId');
      enrolledCourseIds = enrollments.map((e) => e.courseId.toString());
    }

    const coursesWithAccess = courses.map((c) => ({
      ...c.toObject(),
      isEnrolled: enrolledCourseIds.includes(c._id.toString()),
    }));

    sendSuccess(res, 200, 'Courses fetched', {
      courses: coursesWithAccess,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name');
    if (!course || !course.isActive) return sendError(res, 404, 'Course not found');

    // Check enrollment
    let isEnrolled = false;
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({ studentId: req.user._id, courseId: course._id, status: 'success' });
      isEnrolled = !!enrollment;
    } else {
      isEnrolled = true; // teacher/admin can always view
    }

    // Get lessons — only send videoUrl if enrolled
    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
    const safeLessons = lessons.map((l) => {
      const obj = l.toObject();
      if (!isEnrolled) {
        delete obj.videoUrl;
        delete obj.videoPublicId;
      }
      return obj;
    });

    sendSuccess(res, 200, 'Course fetched', {
      course: { ...course.toObject(), isEnrolled },
      lessons: safeLessons,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Teacher / Admin ───

const createCourse = async (req, res, next) => {
  try {
    const { title, description, price, thumbnail } = req.body;
    if (!title || price == null) return sendError(res, 400, 'Title and price are required');

    const course = await Course.create({
      title,
      description,
      price: Number(price),
      thumbnail,
      createdBy: req.user._id,
    });

    sendSuccess(res, 201, 'Course created', { course });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, 404, 'Course not found');

    if (req.user.role === 'teacher' && course.createdBy.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized');
    }

    const { title, description, price, thumbnail, isActive } = req.body;
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, price: price != null ? Number(price) : course.price, thumbnail, isActive },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 200, 'Course updated', { course: updated });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, 404, 'Course not found');

    // Delete all lessons' videos from cloudinary
    const lessons = await Lesson.find({ courseId: course._id });
    for (const lesson of lessons) {
      if (lesson.videoPublicId) {
        await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: 'video' });
      }
    }
    await Lesson.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(req.params.id);

    sendSuccess(res, 200, 'Course deleted');
  } catch (error) {
    next(error);
  }
};

// ─── Lessons ───

const addLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return sendError(res, 404, 'Course not found');

    if (req.user.role === 'teacher' && course.createdBy.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized');
    }

    const { title, description, order, duration } = req.body;
    if (!title) return sendError(res, 400, 'Lesson title is required');

    const lessonData = {
      courseId: course._id,
      title,
      description,
      order: order != null ? Number(order) : 0,
      duration: duration != null ? Number(duration) : 0,
    };

    if (req.file) {
      lessonData.videoUrl = req.file.path;
      lessonData.videoPublicId = req.file.filename;
    } else {
      return sendError(res, 400, 'Video file is required');
    }

    const lesson = await Lesson.create(lessonData);
    sendSuccess(res, 201, 'Lesson added', { lesson });
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return sendError(res, 404, 'Lesson not found');

    const course = await Course.findById(lesson.courseId);
    if (req.user.role === 'teacher' && course.createdBy.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized');
    }

    const { title, description, order, duration } = req.body;
    const updates = { title, description, order, duration };

    if (req.file) {
      if (lesson.videoPublicId) {
        await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: 'video' });
      }
      updates.videoUrl = req.file.path;
      updates.videoPublicId = req.file.filename;
    }

    const updated = await Lesson.findByIdAndUpdate(req.params.lessonId, updates, { new: true, runValidators: true });
    sendSuccess(res, 200, 'Lesson updated', { lesson: updated });
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return sendError(res, 404, 'Lesson not found');

    if (lesson.videoPublicId) {
      await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: 'video' });
    }
    await Lesson.findByIdAndDelete(req.params.lessonId);
    sendSuccess(res, 200, 'Lesson deleted');
  } catch (error) {
    next(error);
  }
};

// ─── Teacher Analytics ───

const getCourseAnalytics = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'teacher') {
      filter.createdBy = req.user._id;
    }

    const courses = await Course.find(filter).select('title price enrollmentCount');
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({ courseId: { $in: courseIds }, status: 'success' })
      .populate('studentId', 'name email')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 });

    const totalRevenue = enrollments.reduce((sum, e) => sum + e.amount, 0);
    const totalStudents = new Set(enrollments.map((e) => e.studentId?._id?.toString())).size;

    sendSuccess(res, 200, 'Course analytics fetched', {
      summary: {
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalStudents,
        totalRevenue,
      },
      courses,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  getCourseAnalytics,
};
