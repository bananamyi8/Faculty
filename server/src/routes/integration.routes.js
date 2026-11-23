const router = require("express").Router();

const Faculty = require("../models/faculty.model");
const Department = require("../models/department.model");
const { verifyIntegrationToken } = require("../middleware/integration.middleware");

router.use(verifyIntegrationToken);

// The API uses numeric ids (facultyId, department_id), not Mongo ObjectIds.
const toId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const fail = (res, status, message) => res.status(status).json({ success: false, message });

// GET /api/v1/integrations/faculty            (?status=ACTIVE and ?department=Name are optional)
router.get("/faculty", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status).toUpperCase();
    if (req.query.department) filter.department = String(req.query.department);

    const faculty = await Faculty.find(filter).sort({ name: 1 });
    res.json({ success: true, count: faculty.length, data: faculty });
  } catch (error) {
    console.error("integration /faculty:", error);
    fail(res, 500, "Unable to retrieve faculty.");
  }
});

// GET /api/v1/integrations/faculty/:id        (:id = facultyId, e.g. 1)
router.get("/faculty/:id", async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return fail(res, 400, "Invalid faculty ID.");

    const faculty = await Faculty.findOne({ facultyId: id });
    if (!faculty) return fail(res, 404, "Faculty not found.");

    res.json({ success: true, data: faculty });
  } catch (error) {
    console.error("integration /faculty/:id:", error);
    fail(res, 500, "Unable to retrieve faculty.");
  }
});

// GET /api/v1/integrations/departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find().sort({ department_name: 1 });
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    console.error("integration /departments:", error);
    fail(res, 500, "Unable to retrieve departments.");
  }
});

// GET /api/v1/integrations/departments/:id    (:id = department_id, e.g. 1)
router.get("/departments/:id", async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return fail(res, 400, "Invalid department ID.");

    const department = await Department.findOne({ department_id: id });
    if (!department) return fail(res, 404, "Department not found.");

    res.json({ success: true, data: department });
  } catch (error) {
    console.error("integration /departments/:id:", error);
    fail(res, 500, "Unable to retrieve department.");
  }
});

module.exports = router;