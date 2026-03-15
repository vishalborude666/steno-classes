require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function updateTeacher() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Hash the new password
    const hashedPassword = await bcrypt.hash('Lucent@999297', 10);

    // Update the teacher's email, password, and name
    const updated = await User.findOneAndUpdate(
      { role: 'teacher' },
      {
        email: 'rohanselukar143@gmail.com',
        password: hashedPassword,
        name: 'Shinde Madam',
      },
      { new: true }
    );

    if (updated) {
      console.log('Teacher updated:', updated);
    } else {
      console.log('No teacher found to update.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

updateTeacher();
