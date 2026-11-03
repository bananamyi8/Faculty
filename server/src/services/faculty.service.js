const repository = require("../data/faculty.repository");
const { validateFaculty, normalizeFaculty } = require("../models/faculty.model");

class ApiError extends Error {
  constructor(status, title, detail) {
    super(detail);
    this.status = status;
    this.title = title;
  }
}

async function getAllFaculty() {
  return repository.findAll();
}

async function getFacultyById(id) {
  const faculty = await repository.findById(id);
  if (!faculty) {
    throw new ApiError(404, "Not Found", `Faculty ID ${id} was not found.`);
  }
  return faculty;
}

async function createFaculty(data) {
  const errors = validateFaculty(data);
  if (errors.length) {
    throw new ApiError(400, "Bad Request", errors.join(" "));
  }

  const normalized = normalizeFaculty(data);
  if (await repository.findByEmail(normalized.email)) {
    throw new ApiError(409, "Conflict", "This email is already registered.");
  }

  return repository.create(normalized);
}

async function updateFaculty(id, data) {
  await getFacultyById(id);

  const errors = validateFaculty(data);
  if (errors.length) {
    throw new ApiError(400, "Bad Request", errors.join(" "));
  }

  const normalized = normalizeFaculty(data);
  const existing = await repository.findByEmail(normalized.email);
  if (existing && existing.facultyId !== id) {
    throw new ApiError(409, "Conflict", "This email is already registered.");
  }

  return repository.update(id, normalized);
}

async function disableFaculty(id) {
  const faculty = await getFacultyById(id);
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
