require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const TEACHER_EMAIL = 'rohanselukar143@gmail.com';
const TEACHER_PASSWORD = 'Lucent@999297';
const TEACHER_NAME = 'Shinde Madam';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: TEACHER_EMAIL });
    if (existing) {
      console.log('Teacher account already exists:', existing.email);
      process.exit(0);
    }

    const teacher = await User.create({
      name: TEACHER_NAME,
      email: TEACHER_EMAIL,
      password: TEACHER_PASSWORD,
      role: 'teacher',
    });

    console.log('Teacher account created successfully!');
    console.log('  Email:', teacher.email);
    console.log('  Password:', TEACHER_PASSWORD);
    console.log('  Role:', teacher.role);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seed();
