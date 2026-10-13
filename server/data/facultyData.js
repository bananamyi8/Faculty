// Mock data only. Records reset whenever the server restarts.
const faculty = [
  {
    facultyId: "FAC-2026-001",
    name: "Rene Catimbang",
    department: "College of Information Technology",
    position: "Assistant Professor",
    email: "rene.catimbang@college.edu",
    status: "ACTIVE",
    updatedAt: "2026-10-01T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: "FAC-2026-002",
    name: "Maria Santos",
    department: "College of Education",
    position: "Instructor",
    email: "maria.santos@college.edu",
    status: "ACTIVE",
    updatedAt: "2026-10-02T09:30:00.000Z",
    disabledAt: null
  }
];

module.exports = faculty;
