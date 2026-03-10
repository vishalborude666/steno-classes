const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Audio storage
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'steno/audio',
    resource_type: 'video', // Cloudinary uses 'video' for audio files
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
  },
});

// PDF storage
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'steno/pdfs',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});

const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
}).single('audio');

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('pdf');

// Video storage for course lessons
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'steno/course-videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mkv', 'avi', 'mov', 'webm'],
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
}).single('video');

// Thumbnail storage for courses
const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'steno/course-thumbnails',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('thumbnail');

module.exports = { uploadAudio, uploadPdf, uploadVideo, uploadThumbnail };
