const express = require("express");
const router = express.Router();
const service = require("../services/faculty.service");

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function sendError(res, status, title, detail, instance) {
  return res.status(status).type("application/problem+json").json({
    type: "about:blank",
    title,
    status,
    detail,
    instance
  });
}

function handleError(error, req, res, next) {
  if (error.code === 11000) {
    return sendError(res, 409, "Conflict", "This email is already registered.", req.originalUrl);
  }
  if (error.status) {
    return sendError(res, error.status, error.title, error.message, req.originalUrl);
  }
  return next(error);
}

router.get("/", async (req, res, next) => {
  try {
    const data = await service.getAllFaculty();
    res.status(200).json(data);
  } catch (error) { next(error); }
});

router.get("/:facultyId", async (req, res, next) => {
  const id = parseId(req.params.facultyId);
  if (!id) return sendError(res, 400, "Bad Request", "Faculty ID must be a positive integer.", req.originalUrl);

  try {
    res.status(200).json(await service.getFacultyById(id));
  } catch (error) { handleError(error, req, res, next); }
});

router.post("/", async (req, res, next) => {
  try {
    const created = await service.createFaculty(req.body || {});
    res.status(201).json(created);
  } catch (error) { handleError(error, req, res, next); }
});

router.put("/:facultyId", async (req, res, next) => {
  const id = parseId(req.params.facultyId);
  if (!id) return sendError(res, 400, "Bad Request", "Faculty ID must be a positive integer.", req.originalUrl);

  try {
    res.status(200).json(await service.updateFaculty(id, req.body || {}));
  } catch (error) { handleError(error, req, res, next); }
});

router.patch("/:facultyId/disable", async (req, res, next) => {
  const id = parseId(req.params.facultyId);
  if (!id) return sendError(res, 400, "Bad Request", "Faculty ID must be a positive integer.", req.originalUrl);

  try {
    res.status(200).json(await service.disableFaculty(id));
  } catch (error) { handleError(error, req, res, next); }
});

module.exports = router;
