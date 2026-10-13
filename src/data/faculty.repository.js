let nextId = 9;

let faculty = [
  {
    facultyId: 1,
    name: "Maria Santos",
    department: "Information Technology",
    position: "Instructor",
    email: "maria.santos@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-01T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: 2,
    name: "Juan Dela Cruz",
    department: "Computer Science",
    position: "Assistant Professor",
    email: "juan.delacruz@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-02T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: 3,
    name: "Ana Reyes",
    department: "Information Technology",
    position: "Senior Instructor",
    email: "ana.reyes@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-03T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: 4,
    name: "Pedro Garcia",
    department: "Mathematics",
    position: "Instructor",
    email: "pedro.garcia@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-04T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: 5,
    name: "Liza Mendoza",
    department: "English",
    position: "Assistant Professor",
    email: "liza.mendoza@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-05T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: 6,
    name: "Carlo Ramos",
    department: "Computer Science",
    position: "Instructor",
    email: "carlo.ramos@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-06T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: 7,
    name: "Grace Flores",
    department: "Science",
    position: "Department Chair",
    email: "grace.flores@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-07T08:00:00.000Z",
    disabledAt: null
  },
  {
    facultyId: 8,
    name: "Mark Villanueva",
    department: "Information Technology",
    position: "Instructor",
    email: "mark.villanueva@example.com",
    status: "INACTIVE",
    updatedAt: "2026-10-08T08:00:00.000Z",
    disabledAt: "2026-10-08T08:00:00.000Z"
  }
];

function findAll() {
  return faculty.map((item) => ({ ...item }));
}

function findById(id) {
  const item = faculty.find((item) => item.facultyId === id);
  return item ? { ...item } : null;
}

function findByEmail(email) {
  const item = faculty.find(
    (item) => item.email.toLowerCase() === email.toLowerCase()
  );
  return item ? { ...item } : null;
}

function create(data) {
  const now = new Date().toISOString();

  const item = {
    facultyId: nextId++,
    ...data,
    status: "ACTIVE",
    updatedAt: now,
    disabledAt: null
  };

  faculty.push(item);
  return { ...item };
}

function update(id, data) {
  const index = faculty.findIndex((item) => item.facultyId === id);

  if (index === -1) return null;

  faculty[index] = {
    ...faculty[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  return { ...faculty[index] };
}

function disable(id) {
  const index = faculty.findIndex((item) => item.facultyId === id);

  if (index === -1) return null;

  faculty[index] = {
    ...faculty[index],
    status: "INACTIVE",
    disabledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return { ...faculty[index] };
}

module.exports = { findAll, findById, findByEmail, create, update, disable };