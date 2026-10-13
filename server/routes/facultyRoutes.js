const express = require("express");
const service = require("../services/facultyService");

const router = express.Router();

function handleError(err, res, next) {
  if (err instanceof service.ApiError) {
    return res.status(err.status).type("application/problem+json").json({
      type: "about:blank",
      title: err.title,
      status: err.status,
      detail: err.message
    });
  }
  return next(err);
}

router.get("/", (req, res, next) => {
  try {
    res.status(200).json(service.getAll());
  } catch (err) {
    handleError(err, res, next);
  }
});

router.post("/", (req, res, next) => {
  try {
    const created = service.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    handleError(err, res, next);
  }
});

router.get("/:facultyId", (req, res, next) => {
  try {
    res.status(200).json(service.getById(req.params.facultyId));
  } catch (err) {
    handleError(err, res, next);
  }
});

router.put("/:facultyId", (req, res, next) => {
  try {
    res.status(200).json(service.update(req.params.facultyId, req.body));
  } catch (err) {
    handleError(err, res, next);
  }
});

router.patch("/:facultyId/disable", (req, res, next) => {
  try {
    res.status(200).json(service.disable(req.params.facultyId));
  } catch (err) {
    handleError(err, res, next);
  }
});

module.exports = router;
