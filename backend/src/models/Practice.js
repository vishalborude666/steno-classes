const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dictationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dictation',
    },
    isAI: {
      type: Boolean,
      default: false,
    },
    aiTopic: {
      type: String,
    },
    transcript: {
      type: String,
    },
    typedText: {
      type: String,
      default: '',
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    wpm: {
      type: Number,
      min: 0,
      default: 0,
    },
    timeTaken: {
      type: Number, // seconds
      min: 0,
      default: 0,
    },
    mistakeCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

practiceSchema.index({ studentId: 1 });
practiceSchema.index({ dictationId: 1 });
practiceSchema.index({ studentId: 1, completedAt: -1 });
practiceSchema.index({ wpm: -1 }); // for leaderboard

module.exports = mongoose.model('Practice', practiceSchema);
