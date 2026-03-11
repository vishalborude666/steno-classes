const Dictation = require('../models/Dictation');
const cloudinary = require('../config/cloudinary');
const { getDailyIndex } = require('../utils/dailyChallenge');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getDictations = async (req, res, next) => {
  try {
    const { difficulty, language, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.dictationLanguage = language;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [dictations, total] = await Promise.all([
      Dictation.find(filter)
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Dictation.countDocuments(filter),
    ]);

    sendSuccess(res, 200, 'Dictations fetched', {
      dictations,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const getDictation = async (req, res, next) => {
  try {
    const dictation = await Dictation.findById(req.params.id).populate('uploadedBy', 'name');
    if (!dictation || !dictation.isActive) return sendError(res, 404, 'Dictation not found');

    sendSuccess(res, 200, 'Dictation fetched', { dictation });
  } catch (error) {
    next(error);
  }
};

const createDictation = async (req, res, next) => {
  try {
    const { title, description, transcript, youtubeLink, difficulty, language } = req.body;

    const dictationData = {
      title,
      description,
      transcript,
      youtubeLink,
      difficulty,
      dictationLanguage: language || 'english',
      uploadedBy: req.user._id,
    };

    if (req.file) {
      dictationData.audioUrl = req.file.path;
      dictationData.audioPublicId = req.file.filename;
    }

    const dictation = await Dictation.create(dictationData);
    sendSuccess(res, 201, 'Dictation created', { dictation });
  } catch (error) {
    next(error);
  }
};

const updateDictation = async (req, res, next) => {
  try {
    const dictation = await Dictation.findById(req.params.id);
    if (!dictation) return sendError(res, 404, 'Dictation not found');

    // Teachers can only edit their own dictations
    if (req.user.role === 'teacher' && dictation.uploadedBy.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized to edit this dictation');
    }

    const { title, description, transcript, youtubeLink, difficulty, language } = req.body;
    const updates = { title, description, transcript, youtubeLink, difficulty, dictationLanguage: language };

    if (req.file) {
      // Delete old audio from cloudinary if exists
      if (dictation.audioPublicId) {
        await cloudinary.uploader.destroy(dictation.audioPublicId, { resource_type: 'video' });
      }
      updates.audioUrl = req.file.path;
      updates.audioPublicId = req.file.filename;
    }

    const updated = await Dictation.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    sendSuccess(res, 200, 'Dictation updated', { dictation: updated });
  } catch (error) {
    next(error);
  }
};

const deleteDictation = async (req, res, next) => {
  try {
    const dictation = await Dictation.findByIdAndDelete(req.params.id);
    if (!dictation) return sendError(res, 404, 'Dictation not found');

    if (dictation.audioPublicId) {
      await cloudinary.uploader.destroy(dictation.audioPublicId, { resource_type: 'video' });
    }

    sendSuccess(res, 200, 'Dictation deleted');
  } catch (error) {
    next(error);
  }
};

const getDailyChallenge = async (req, res, next) => {
  try {
    const dictations = await Dictation.find({ isActive: true }).select('_id title difficulty');
    if (dictations.length === 0) return sendError(res, 404, 'No dictations available');

    const index = getDailyIndex(dictations.length);
    const daily = await Dictation.findById(dictations[index]._id).populate('uploadedBy', 'name');

    sendSuccess(res, 200, 'Daily challenge fetched', { dictation: daily });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDictations, getDictation, createDictation, updateDictation, deleteDictation, getDailyChallenge };
