const faculty = require("../data/facultyData");

class ApiError extends Error {
  constructor(status, title, detail) {
    super(detail);
    this.status = status;
    this.title = title;
  }
}

function now() {
  return new Date().toISOString();
}

function validateFaculty(body, isUpdate = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "Bad Request", "A JSON object is required.");
  }

  if (!isUpdate) {
    if (typeof body.facultyId !== "string" ||
        !/^[A-Za-z0-9-]{1,30}$/.test(body.facultyId.trim())) {
      throw new ApiError(400, "Bad Request",
        "facultyId is required and may contain only letters, numbers, and hyphens.");
    }
  }

  for (const field of ["name", "department", "position"]) {
    if (typeof body[field] !== "string" || body[field].trim().length < 2) {
      throw new ApiError(400, "Bad Request",
        `${field} is required and must contain at least 2 characters.`);
    }
  }

  if (body.email !== undefined &&
      (typeof body.email !== "string" ||
       !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(body.email))) {
    throw new ApiError(400, "Bad Request", "email must be a valid email address.");
  }

  if (body.status !== undefined &&
      !["ACTIVE", "INACTIVE"].includes(body.status)) {
    throw new ApiError(400, "Bad Request", "status must be ACTIVE or INACTIVE.");
  }
}

function getAll() {
  return faculty;
}

function getById(facultyId) {
  const record = faculty.find(item => item.facultyId === facultyId);
  if (!record) {
    throw new ApiError(404, "Not Found", `Faculty record '${facultyId}' was not found.`);
  }
  return record;
}

function create(body) {
  validateFaculty(body);

  if (faculty.some(item => item.facultyId === body.facultyId.trim())) {
    throw new ApiError(409, "Conflict", `Faculty ID '${body.facultyId}' already exists.`);
  }

  if (body.email && faculty.some(item => item.email === body.email)) {
    throw new ApiError(409, "Conflict", "That email address is already assigned.");
  }

  const timestamp = now();
  const record = {
    facultyId: body.facultyId.trim(),
    name: body.name.trim(),
    department: body.department.trim(),
    position: body.position.trim(),
    ...(body.email ? { email: body.email.trim() } : {}),
    status: body.status || "ACTIVE",
    updatedAt: timestamp,
    disabledAt: body.status === "INACTIVE" ? timestamp : null
  };

  faculty.push(record);
  return record;
}

function update(facultyId, body) {
  const record = getById(facultyId);
  validateFaculty(body, true);

  if (body.email &&
      faculty.some(item => item.facultyId !== facultyId && item.email === body.email)) {
    throw new ApiError(409, "Conflict", "That email address is already assigned.");
  }

  record.name = body.name.trim();
  record.department = body.department.trim();
  record.position = body.position.trim();

  if (body.email !== undefined) record.email = body.email.trim();

  if (body.status !== undefined) {
    record.status = body.status;
    record.disabledAt = body.status === "INACTIVE"
      ? (record.disabledAt || now())
      : null;
  }

  record.updatedAt = now();
  return record;
}

function disable(facultyId) {
  const record = getById(facultyId);
  if (record.status !== "INACTIVE") {
    record.status = "INACTIVE";
    record.disabledAt = now();
    record.updatedAt = record.disabledAt;
  }
  return record;
}

module.exports = { ApiError, getAll, getById, create, update, disable };
