const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function updateTeacher() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Hash the new password
    const hashedPassword = await bcrypt.hash('Lucent@999297', 10);

    // Upsert the teacher by email (create if not exists)
    const updated = await User.findOneAndUpdate(
      { email: 'rohanselukar143@gmail.com' },
      {
        $set: {
          name: 'Shinde Madam',
          password: hashedPassword,
          role: 'teacher',
          isActive: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('Teacher upserted:', { email: updated.email, name: updated.name, role: updated.role, _id: updated._id });
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    try { await mongoose.disconnect(); } catch(e) {}
    process.exit(1);
  }
}

updateTeacher();
