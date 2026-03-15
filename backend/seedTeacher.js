require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const TEACHER_EMAIL = 'vishalborude666@gmail.com';
const TEACHER_PASSWORD = 'Teacher@123';
const TEACHER_NAME = 'Admin Teacher';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: TEACHER_EMAIL });
    if (existing) {
      console.log('Teacher account already exists:', existing.email);
      process.exit(0);
    }

 const updated = await User.findOneAndUpdate(
  { email: 'rohanselukar143@gmail.com' },
  {
    password: hashedPassword,
    name: 'Shinde Madam',
    role: 'teacher'
  },
  { new: true }
);

    console.log('Teacher account created successfully!');
    console.log('  Email:', updated.email);
    console.log('  Password:', TEACHER_PASSWORD);
    console.log('  Role:', updated.role);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seed();
