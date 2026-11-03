// Run once: node server/seed.js   (only inserts when the collections are empty)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Department = require('./models/Department');
const Faculty = require('./models/Faculty');

(async () => {
  await connectDB();

  if ((await Department.countDocuments()) === 0) {
    const depts = await Department.insertMany([
      { name: 'Information Technology', description: 'IT programs and systems' },
      { name: 'Computer Science', description: 'Computing theory and software' },
      { name: 'Business Administration', description: 'Management and business studies' },
    ]);
    console.log('Seeded departments');

    if ((await Faculty.countDocuments()) === 0) {
      await Faculty.insertMany([
        { fullName: 'Maria Santos', department: depts[0]._id, position: 'Professor', email: 'maria.santos@example.edu' },
        { fullName: 'Juan Dela Cruz', department: depts[1]._id, position: 'Associate Professor', email: 'juan.delacruz@example.edu' },
        { fullName: 'Ana Reyes', department: depts[2]._id, position: 'Lecturer', email: 'ana.reyes@example.edu' },
      ]);
      console.log('Seeded faculty');
    }
  } else {
    console.log('Data already exists, nothing seeded');
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
