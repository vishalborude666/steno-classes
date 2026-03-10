const LearningVideo = require('../models/LearningVideo');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getLearningVideos = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [videos, total] = await Promise.all([
      LearningVideo.find(filter)
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      LearningVideo.countDocuments(filter),
    ]);

    sendSuccess(res, 200, 'Learning videos fetched', {
      videos,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const createLearningVideo = async (req, res, next) => {
  try {
    const { title, description, youtubeLink } = req.body;

    if (!title || !youtubeLink) {
      return sendError(res, 400, 'Title and YouTube link are required');
    }

    const video = await LearningVideo.create({
      title,
      description,
      youtubeLink,
      uploadedBy: req.user._id,
    });

    sendSuccess(res, 201, 'Learning video added', { video });
  } catch (error) {
    next(error);
  }
};

const updateLearningVideo = async (req, res, next) => {
  try {
    const video = await LearningVideo.findById(req.params.id);
    if (!video) return sendError(res, 404, 'Video not found');

    if (req.user.role === 'teacher' && video.uploadedBy.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized to edit this video');
    }

    const { title, description, youtubeLink } = req.body;
    const updated = await LearningVideo.findByIdAndUpdate(
      req.params.id,
      { title, description, youtubeLink },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 200, 'Learning video updated', { video: updated });
  } catch (error) {
    next(error);
  }
};

const deleteLearningVideo = async (req, res, next) => {
  try {
    const video = await LearningVideo.findByIdAndDelete(req.params.id);
    if (!video) return sendError(res, 404, 'Video not found');

    sendSuccess(res, 200, 'Learning video deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { getLearningVideos, createLearningVideo, updateLearningVideo, deleteLearningVideo };
