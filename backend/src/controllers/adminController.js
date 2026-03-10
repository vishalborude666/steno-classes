const User = require('../models/User');
const Dictation = require('../models/Dictation');
const Practice = require('../models/Practice');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    sendSuccess(res, 200, 'Users fetched', { users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['student', 'teacher', 'admin'];
    if (!allowedRoles.includes(role)) return sendError(res, 400, 'Invalid role');

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return sendError(res, 404, 'User not found');

    sendSuccess(res, 200, 'User role updated', { user });
  } catch (error) {
    next(error);
  }
};

const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.isActive = !user.isActive;
    await user.save();

    sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, { user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    sendSuccess(res, 200, 'User deleted');
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalTeachers, totalStudents, totalDictations, totalPractices] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' }),
      Dictation.countDocuments({ isActive: true }),
      Practice.countDocuments(),
    ]);

    const avgStats = await Practice.aggregate([
      {
        $group: {
          _id: null,
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
        },
      },
    ]);

    const avgWpm = avgStats.length ? Math.round(avgStats[0].avgWpm) : 0;
    const avgAccuracy = avgStats.length ? Math.round(avgStats[0].avgAccuracy) : 0;

    // Practices over last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyActivity = await Practice.aggregate([
      { $match: { completedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    sendSuccess(res, 200, 'Analytics fetched', {
      analytics: { totalUsers, totalTeachers, totalStudents, totalDictations, totalPractices, avgWpm, avgAccuracy },
      dailyActivity,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDictations = async (req, res, next) => {
  try {
    const dictations = await Dictation.find({})
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Dictations fetched', { dictations });
  } catch (error) {
    next(error);
  }
};

const toggleDictationActive = async (req, res, next) => {
  try {
    const d = await Dictation.findById(req.params.id);
    if (!d) return sendError(res, 404, 'Dictation not found');
    d.isActive = !d.isActive;
    await d.save();
    sendSuccess(res, 200, `Dictation ${d.isActive ? 'activated' : 'deactivated'}`, { dictation: d });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUserRole, toggleUserActive, deleteUser, getAnalytics, getAllDictations, toggleDictationActive };
