const repository = require("../data/faculty.repository");
const { validateFaculty, normalizeFaculty } = require("../models/faculty.model");

class ApiError extends Error {
  constructor(status, title, detail) {
    super(detail);
    this.status = status;
    this.title = title;
  }
}

function getAllFaculty() {
  return repository.findAll();
}

function getFacultyById(id) {
  const faculty = repository.findById(id);

  if (!faculty) {
    throw new ApiError(404, "Not Found", `Faculty ID ${id} was not found.`);
  }

  return faculty;
}

function createFaculty(data) {
  const errors = validateFaculty(data);

  if (errors.length) {
    throw new ApiError(400, "Bad Request", errors.join(" "));
  }

  const normalized = normalizeFaculty(data);

  if (repository.findByEmail(normalized.email)) {
    throw new ApiError(409, "Conflict", "This email is already registered.");
  }

  return repository.create(normalized);
}

function updateFaculty(id, data) {
  getFacultyById(id);

  const errors = validateFaculty(data);

  if (errors.length) {
    throw new ApiError(400, "Bad Request", errors.join(" "));
  }

  const normalized = normalizeFaculty(data);
  const existing = repository.findByEmail(normalized.email);

  if (existing && existing.facultyId !== id) {
    throw new ApiError(409, "Conflict", "This email is already registered.");
  }

  return repository.update(id, normalized);
}

function disableFaculty(id) {
  const faculty = getFacultyById(id);

  if (faculty.status === "INACTIVE") {
    throw new ApiError(400, "Bad Request", "Faculty is already inactive.");
  }

  return repository.disable(id);
}

module.exports = {
  ApiError,
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  disableFaculty
};