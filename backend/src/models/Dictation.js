const mongoose = require('mongoose');
const { DIFFICULTY, LANGUAGE } = require('../config/constants');

const dictationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    transcript: {
      type: String,
      trim: true,
      default: '',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    audioPublicId: {
      type: String,
      default: '',
    },
    youtubeLink: {
      type: String,
      default: '',
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    pdfPublicId: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY),
      default: DIFFICULTY.MEDIUM,
    },
    dictationLanguage: {
      type: String,
      enum: Object.values(LANGUAGE),
      default: LANGUAGE.ENGLISH,
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
    practiceCount: {
      type: Number,
      default: 0,
    },
    durationSeconds: {
      type: Number,
      default: 300, // default 5 minutes
    },
  },
  { timestamps: true }
);

dictationSchema.index({ difficulty: 1 });
dictationSchema.index({ dictationLanguage: 1 });
dictationSchema.index({ uploadedBy: 1 });
dictationSchema.index({ isActive: 1 });
dictationSchema.index({ title: 'text', description: 'text' }, { language_override: 'searchLanguage' });

module.exports = mongoose.model('Dictation', dictationSchema);
