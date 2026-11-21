// Optional: node seed.js         -> adds starter data ONLY to empty collections
//           node seed.js --reset -> wipes departments/faculty/non-faculty/subjects/schedules first
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const connectDB = require("./src/config/database");

const Department = require("./src/models/department.model");
const Faculty = require("./src/models/faculty.model");
const NonFaculty = require("./src/models/nonfaculty.model");
const Subject = require("./src/models/subject.model");
const Schedule = require("./src/models/schedule.model");

(async () => {
  await connectDB();

  if (process.argv.includes("--reset")) {
    await Promise.all([Department, Faculty, NonFaculty, Subject, Schedule].map((m) => m.deleteMany({})));
    console.log("Collections cleared.");
  }
  for (const m of [Department, Faculty, NonFaculty, Subject, Schedule]) await m.syncIndexes();

  const empty = async (m) => (await m.countDocuments()) === 0;

  if (await empty(Department)) {
    await Department.insertMany([
      { department_id: 1, department_name: "Information Technology", description: "IT programs and systems" },
      { department_id: 2, department_name: "Computer Science", description: "Computing theory and software" },
      { department_id: 3, department_name: "Business Administration", description: "Management and business studies" },
    ]);
    console.log("Seeded departments");
  }
  if (await empty(Faculty)) {
    await Faculty.insertMany([
      { facultyId: 1, name: "Maria Santos", department: "Information Technology", position: "Professor", email: "maria.santos@example.edu" },
      { facultyId: 2, name: "Juan Dela Cruz", department: "Computer Science", position: "Associate Professor", email: "juan.delacruz@example.edu" },
    ]);
    console.log("Seeded faculty");
  }
  if (await empty(NonFaculty)) {
    await NonFaculty.insertMany([
      { nonFacultyId: 1, employeeId: "NF-001", name: "Ana Reyes", department: "Business Administration", position: "Registrar Staff", email: "ana.reyes@example.edu" },
    ]);
    console.log("Seeded non-faculty");
  }
  if (await empty(Subject)) {
    await Subject.insertMany([
      { subjectId: 1, code: "IT101", name: "Introduction to Computing", department: "Information Technology", units: 3 },
      { subjectId: 2, code: "CS201", name: "Data Structures", department: "Computer Science", units: 3 },
    ]);
    console.log("Seeded subjects");
  }
  if (await empty(Schedule)) {
    await Schedule.insertMany([
      { scheduleId: 1, subject: "IT101 - Introduction to Computing", faculty: "Maria Santos", section: "BSIT-1A", day: "Monday", startTime: "08:00", endTime: "10:00", room: "Lab 1" },
    ]);
    console.log("Seeded schedules");
  }

  await mongoose.disconnect();
  console.log("Done.");
})().catch((e) => { console.error(e); process.exit(1); });
