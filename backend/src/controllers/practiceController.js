const Practice = require('../models/Practice');
const Dictation = require('../models/Dictation');
const { calculateWPM } = require('../utils/wpmCalculator');
const { calculateAccuracy } = require('../utils/accuracyCalculator');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const submitPractice = async (req, res, next) => {
  try {
    const { dictationId, typedText, timeTaken } = req.body;

    const dictation = await Dictation.findById(dictationId);
    if (!dictation) return sendError(res, 404, 'Dictation not found');

    const wpm = calculateWPM(typedText, timeTaken);
    const { accuracy, mistakeCount } = calculateAccuracy(dictation.transcript, typedText);

    const practice = await Practice.create({
      studentId: req.user._id,
      dictationId,
      typedText,
      accuracy,
      wpm,
      timeTaken,
      mistakeCount,
    });

    // Increment practice count
    await Dictation.findByIdAndUpdate(dictationId, { $inc: { practiceCount: 1 } });

    sendSuccess(res, 201, 'Practice submitted', {
      practice: { _id: practice._id, wpm, accuracy, mistakeCount, timeTaken },
    });
  } catch (error) {
    next(error);
  }
};

const getMyHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [history, total] = await Promise.all([
      Practice.find({ studentId: req.user._id })
        .populate('dictationId', 'title difficulty')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Practice.countDocuments({ studentId: req.user._id }),
    ]);

    sendSuccess(res, 200, 'History fetched', {
      history,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const getMyStats = async (req, res, next) => {
  try {
    const practices = await Practice.find({ studentId: req.user._id });

    if (practices.length === 0) {
      return sendSuccess(res, 200, 'Stats fetched', {
        stats: { totalSessions: 0, avgWpm: 0, avgAccuracy: 0, bestWpm: 0 },
      });
    }

    const totalSessions = practices.length;
    const avgWpm = Math.round(practices.reduce((s, p) => s + p.wpm, 0) / totalSessions);
    const avgAccuracy = Math.round(practices.reduce((s, p) => s + p.accuracy, 0) / totalSessions);
    const bestWpm = Math.max(...practices.map((p) => p.wpm));

    // WPM over last 30 sessions for graph
    const recent = await Practice.find({ studentId: req.user._id })
      .populate('dictationId', 'title')
      .sort({ completedAt: -1 })
      .limit(30)
      .select('wpm accuracy completedAt dictationId');

    sendSuccess(res, 200, 'Stats fetched', {
      stats: { totalSessions, avgWpm, avgAccuracy, bestWpm },
      chartData: recent.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Practice.aggregate([
      {
        $group: {
          _id: '$studentId',
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          totalSessions: { $sum: 1 },
          bestWpm: { $max: '$wpm' },
        },
      },
      { $sort: { avgWpm: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $project: {
          'student.name': 1,
          'student.avatar': 1,
          avgWpm: { $round: ['$avgWpm', 0] },
          avgAccuracy: { $round: ['$avgAccuracy', 0] },
          totalSessions: 1,
          bestWpm: 1,
        },
      },
    ]);

    sendSuccess(res, 200, 'Leaderboard fetched', { leaderboard });
  } catch (error) {
    next(error);
  }
};

const getStudentHistory = async (req, res, next) => {
  try {
    const history = await Practice.find({ studentId: req.params.studentId })
      .populate('dictationId', 'title difficulty')
      .sort({ completedAt: -1 })
      .limit(50);

    sendSuccess(res, 200, 'Student history fetched', { history });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitPractice, getMyHistory, getMyStats, getLeaderboard, getStudentHistory };
