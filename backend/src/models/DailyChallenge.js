const mongoose = require('mongoose');

const DailyChallengeSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    dictation: { type: mongoose.Schema.Types.ObjectId, ref: 'Dictation', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyChallenge', DailyChallengeSchema);
