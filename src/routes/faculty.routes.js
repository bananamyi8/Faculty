const express = require("express");
const router = express.Router();

let nextId = 4;

let faculty = [
  {
    facultyId: 1,
    name: "Maria Santos",
    department: "Information Technology",
    position: "Instructor",
    email: "maria.santos@example.com",
    status: "ACTIVE"
  },
  {
    facultyId: 2,
    name: "Juan Dela Cruz",
    department: "Computer Science",
    position: "Assistant Professor",
    email: "juan.delacruz@example.com",
    status: "ACTIVE"
  },
  {
    facultyId: 3,
    name: "Ana Reyes",
    department: "Mathematics",
    position: "Instructor",
    email: "ana.reyes@example.com",
    status: "ACTIVE"
  }
];

// Validate faculty input
function validateFaculty(data) {
  const errors = [];

  if (typeof data.name !== "string" || !data.name.trim()) {
    errors.push("Name is required.");
  }

  if (
    typeof data.department !== "string" ||
    !data.department.trim()
  ) {
    errors.push("Department is required.");
  }

  if (
    typeof data.position !== "string" ||
    !data.position.trim()
  ) {
    errors.push("Position is required.");
  }

  if (
    typeof data.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
  ) {
    errors.push("A valid email address is required.");
  }

  return errors;
}

// Check whether an email is already used
function emailExists(email, exceptId = null) {
  return faculty.some(
    item =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.facultyId !== exceptId
  );
}

// Standard Problem Details error response
function sendError(res, status, title, detail, instance) {
  return res.status(status)
    .type("application/problem+json")
    .json({
      type: "about:blank",
      title,
      status,
      detail,
      instance
    });
}

// GET: View all faculty
router.get("/", (req, res) => {
  res.json(faculty);
});

// GET: View faculty by ID
router.get("/:facultyId", (req, res) => {
  const id = Number(req.params.facultyId);

  if (!Number.isInteger(id) || id <= 0) {
    return sendError(
      res, 400, "Bad Request",
      "Faculty ID must be a positive integer.",
      req.originalUrl
    );
  }

  const member = faculty.find(item => item.facultyId === id);

  if (!member) {
    return sendError(
      res, 404, "Not Found",
      `Faculty ID ${id} was not found.`,
      req.originalUrl
    );
  }

  res.json(member);
});

// POST: Add new faculty
router.post("/", (req, res) => {
  const data = req.body || {};
  const errors = validateFaculty(data);

  if (errors.length) {
    return sendError(
      res, 400, "Bad Request",
      errors.join(" "),
      req.originalUrl
    );
  }

  const email = data.email.trim().toLowerCase();

  if (emailExists(email)) {
    return sendError(
      res, 409, "Conflict",
      "This email is already registered.",
      req.originalUrl
    );
  }

  const newFaculty = {
    facultyId: nextId++,
    name: data.name.trim(),
    department: data.department.trim(),
    position: data.position.trim(),
    email,
    status: "ACTIVE"
  };

  faculty.push(newFaculty);

  res.status(201).json(newFaculty);
});

// PUT: Update all editable faculty fields
router.put("/:facultyId", (req, res) => {
  const id = Number(req.params.facultyId);

  if (!Number.isInteger(id) || id <= 0) {
    return sendError(
      res, 400, "Bad Request",
      "Faculty ID must be a positive integer.",
      req.originalUrl
    );
  }

  const index = faculty.findIndex(item => item.facultyId === id);

  if (index === -1) {
    return sendError(
      res, 404, "Not Found",
      `Faculty ID ${id} was not found.`,
      req.originalUrl
    );
  }

  const data = req.body || {};
  const errors = validateFaculty(data);

  if (errors.length) {
    return sendError(
      res, 400, "Bad Request",
      errors.join(" "),
      req.originalUrl
    );
  }

  const email = data.email.trim().toLowerCase();

  if (emailExists(email, id)) {
    return sendError(
      res, 409, "Conflict",
      "This email is already registered to another faculty member.",
      req.originalUrl
    );
  }

  faculty[index] = {
    ...faculty[index],
    name: data.name.trim(),
    department: data.department.trim(),
    position: data.position.trim(),
    email
  };

  res.json(faculty[index]);
});

// PATCH: Deactivate faculty
router.patch("/:facultyId/disable", (req, res) => {
  const id = Number(req.params.facultyId);

  if (!Number.isInteger(id) || id <= 0) {
    return sendError(
      res, 400, "Bad Request",
      "Faculty ID must be a positive integer.",
      req.originalUrl
    );
  }

  const member = faculty.find(item => item.facultyId === id);

  if (!member) {
    return sendError(
      res, 404, "Not Found",
      `Faculty ID ${id} was not found.`,
      req.originalUrl
    );
  }

  if (member.status === "INACTIVE") {
    return sendError(
      res, 400, "Bad Request",
      "Faculty member is already inactive.",
      req.originalUrl
    );
  }

  member.status = "INACTIVE";

  res.json(member);
});

module.exports = router;