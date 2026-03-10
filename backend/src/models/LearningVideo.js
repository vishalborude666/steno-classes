const mongoose = require('mongoose');

const learningVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    youtubeLink: {
      type: String,
      required: [true, 'YouTube link is required'],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

learningVideoSchema.index({ isActive: 1 });
learningVideoSchema.index({ uploadedBy: 1 });
learningVideoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('LearningVideo', learningVideoSchema);
