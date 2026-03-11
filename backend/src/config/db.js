const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // One-time cleanup: drop old conflicting indexes
    try {
      const db = conn.connection.db;
      const collection = db.collection('dictations');
      const indexes = await collection.indexes();
      for (const idx of indexes) {
        if (idx.name === 'language_1' || (idx.key && idx.key._fts === 'text' && !idx.language_override)) {
          await collection.dropIndex(idx.name);
          console.log(`Dropped old index: ${idx.name}`);
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
