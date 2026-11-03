const Faculty = require("../models/Faculty");

// GET ALL FACULTY
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();

    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve faculty",
      error: error.message
    });
  }
};

// GET FACULTY BY ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({
      facultyId: req.params.id
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found"
      });
    }

    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve faculty",
      error: error.message
    });
  }
};

// ADD FACULTY
exports.createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);

    res.status(201).json({
      message: "Faculty added successfully",
      data: faculty
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add faculty",
      error: error.message
    });
  }
};

// UPDATE FACULTY
exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findOneAndUpdate(
      { facultyId: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found"
      });
    }

    res.status(200).json({
      message: "Faculty updated successfully",
      data: faculty
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update faculty",
      error: error.message
    });
  }
};

// DELETE FACULTY
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findOneAndDelete({
      facultyId: req.params.id
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found"
      });
    }

    res.status(200).json({
      message: "Faculty deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete faculty",
      error: error.message
    });
  }
};