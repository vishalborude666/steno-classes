const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    videoPublicId: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
  },
  { timestamps: true }
);

lessonSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
