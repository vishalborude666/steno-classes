const Dictation = require('../models/Dictation');
const Practice = require('../models/Practice');
const User = require('../models/User');
const XLSX = require('xlsx');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const sendEmail = require('../utils/sendEmail');

const createStudent = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 400, 'Email already registered');

    const student = await User.create({ name, email, password, role: 'student' });

    // Send welcome email with credentials
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #2563eb;">Welcome to Lucent Shorthand Classes!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your teacher has created an account for you. Here are your login credentials:</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 4px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <p>Please change your password after your first login.</p>
        <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; padding: 12px 28px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Login Now</a>
      </div>
    `;

    try {
      await sendEmail({ to: email, subject: 'Lucent Shorthand Classes — Your Account is Ready', html });
    } catch (emailErr) {
      // Account created but email failed — don't block
      console.error('Welcome email failed:', emailErr.message);
    }

    sendSuccess(res, 201, 'Student account created', {
      student: { _id: student._id, name: student.name, email: student.email, role: student.role, isActive: student.isActive, createdAt: student.createdAt },
    });
  } catch (error) {
    next(error);
  }
};

const toggleStudentStatus = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) return sendError(res, 404, 'Student not found');

    student.isActive = !student.isActive;
    await student.save({ validateBeforeSave: false });

    sendSuccess(res, 200, `Student ${student.isActive ? 'activated' : 'deactivated'}`, {
      student: { _id: student._id, name: student.name, email: student.email, isActive: student.isActive },
    });
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email isActive createdAt').sort({ createdAt: -1 });

    // Attach quick practice stats
    const enriched = await Promise.all(
      students.map(async (s) => {
        const practices = await Practice.find({ studentId: s._id });
        const avgWpm = practices.length ? Math.round(practices.reduce((sum, p) => sum + p.wpm, 0) / practices.length) : 0;
        const avgAccuracy = practices.length ? Math.round(practices.reduce((sum, p) => sum + p.accuracy, 0) / practices.length) : 0;
        return { ...s.toObject(), avgWpm, avgAccuracy, totalSessions: practices.length };
      })
    );

    sendSuccess(res, 200, 'All students fetched', { students: enriched });
  } catch (error) {
    next(error);
  }
};

const getMyDictations = async (req, res, next) => {
  try {
    const dictations = await Dictation.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, 200, 'My dictations fetched', { dictations });
  } catch (error) {
    next(error);
  }
};

const getMyStudents = async (req, res, next) => {
  try {
    // Students who practiced any dictation uploaded by this teacher
    const myDictationIds = await Dictation.find({ uploadedBy: req.user._id }).select('_id');
    const ids = myDictationIds.map((d) => d._id);

    const studentIds = await Practice.distinct('studentId', { dictationId: { $in: ids } });
    const students = await User.find({ _id: { $in: studentIds }, role: 'student' }).select('name email createdAt');

    // Attach quick stats
    const enriched = await Promise.all(
      students.map(async (s) => {
        const practices = await Practice.find({ studentId: s._id, dictationId: { $in: ids } });
        const avgWpm = practices.length
          ? Math.round(practices.reduce((sum, p) => sum + p.wpm, 0) / practices.length)
          : 0;
        const avgAccuracy = practices.length
          ? Math.round(practices.reduce((sum, p) => sum + p.accuracy, 0) / practices.length)
          : 0;
        return { ...s.toObject(), avgWpm, avgAccuracy, totalSessions: practices.length };
      })
    );

    sendSuccess(res, 200, 'Students fetched', { students: enriched });
  } catch (error) {
    next(error);
  }
};

const getStudentReport = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const myDictationIds = await Dictation.find({ uploadedBy: req.user._id }).select('_id');
    const ids = myDictationIds.map((d) => d._id);

    const history = await Practice.find({ studentId, dictationId: { $in: ids } })
      .populate('dictationId', 'title difficulty')
      .sort({ completedAt: -1 });

    const student = await User.findById(studentId).select('name email');
    sendSuccess(res, 200, 'Student report fetched', { student, history });
  } catch (error) {
    next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
    const myDictationIds = await Dictation.find({ uploadedBy: req.user._id }).select('_id title');
    const ids = myDictationIds.map((d) => d._id);

    const practices = await Practice.find({ dictationId: { $in: ids } })
      .populate('studentId', 'name email')
      .populate('dictationId', 'title difficulty');

    const data = practices.map((p) => ({
      Student: p.studentId?.name || 'Unknown',
      Email: p.studentId?.email || '',
      Dictation: p.dictationId?.title || '',
      Difficulty: p.dictationId?.difficulty || '',
      WPM: p.wpm,
      Accuracy: `${p.accuracy}%`,
      'Time (s)': p.timeTaken,
      Date: new Date(p.completedAt).toLocaleDateString(),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=student_report.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = { createStudent, toggleStudentStatus, getAllStudents, getMyDictations, getMyStudents, getStudentReport, exportExcel };
