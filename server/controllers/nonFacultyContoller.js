
const NonFaculty = require("../models/NonFaculty");

// GET ALL NON-FACULTY RECORDS
exports.getAllNonFaculty = async (req, res) => {
  try {
    const records = await NonFaculty.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE NON-FACULTY RECORD
exports.getNonFacultyById = async (req, res) => {
  try {
    const record = await NonFaculty.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Non-Faculty record not found"
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD NEW NON-FACULTY RECORD
exports.createNonFaculty = async (req, res) => {
  try {
    const newRecord = await NonFaculty.create(req.body);

    res.status(201).json({
      success: true,
      message: "Non-Faculty record added successfully",
      data: newRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE NON-FACULTY RECORD
exports.updateNonFaculty = async (req, res) => {
  try {
    const updatedRecord = await NonFaculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: "Non-Faculty record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Non-Faculty record updated successfully",
      data: updatedRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE NON-FACULTY RECORD
exports.deleteNonFaculty = async (req, res) => {
  try {
    const deletedRecord = await NonFaculty.findByIdAndDelete(
      req.params.id
    );

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "Non-Faculty record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Non-Faculty record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// SEARCH NON-FACULTY RECORDS
exports.searchNonFaculty = async (req, res) => {
  try {
    const { search } = req.query;

    const records = await NonFaculty.find({
      $or: [
        { employeeId: { $regex: search || "", $options: "i" } },
        { firstName: { $regex: search || "", $options: "i" } },
        { lastName: { $regex: search || "", $options: "i" } },
        { position: { $regex: search || "", $options: "i" } },
        { department: { $regex: search || "", $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
