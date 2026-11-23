
const router = require("express").Router();
const mongoose = require("mongoose");

const Faculty = require("../models/faculty.model");
const Department = require("../models/department.model");

const {
  verifyIntegrationToken
} = require("../middleware/integration.middleware");

router.use(verifyIntegrationToken);

// GET all faculty
router.get("/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate("department")
      .sort({ fullName: 1 });

    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve faculty."
    });
  }
});

// GET one faculty member
router.get("/faculty/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty ID."
      });
    }

    const faculty = await Faculty.findById(req.params.id)
      .populate("department");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found."
      });
    }

    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve faculty."
    });
  }
});

// GET all departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve departments."
    });
  }
});

// GET one department
router.get("/departments/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID."
      });
    }

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found."
      });
    }

    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve department."
    });
  }
});

module.exports = router;
