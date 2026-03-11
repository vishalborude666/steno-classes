const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // One-time cleanup: drop old text index if it has wrong language_override
    try {
      const col = conn.connection.db.collection('dictations');
      const indexes = await col.indexes();
      for (const idx of indexes) {
        if (idx.name === 'language_1') {
          await col.dropIndex(idx.name);
          console.log('Dropped old language_1 index');
        }
        if (idx.key && idx.key._fts === 'text' && idx.language_override === 'language') {
          await col.dropIndex(idx.name);
          console.log('Dropped old text index with wrong language_override');
        }
      }
    } catch (e) {
      // Ignore if indexes don't exist
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
