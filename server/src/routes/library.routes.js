
const express = require("express");
const libraryApi = require("../config/libraryApi");

const router = express.Router();

// Get books from Library System
router.get("/books", async (req, res) => {
  try {
    const response = await libraryApi.get("/books");

    res.json(response.data);
  } catch (error) {
    console.error("Library API Error:", error.message);

    res.status(503).json({
      success: false,
      message: "Library System is currently unavailable.",
    });
  }
});

// Get borrowing records
router.get("/borrowings/:facultyId", async (req, res) => {
  try {
    const { facultyId } = req.params;

    const response = await libraryApi.get(
      `/borrowings/faculty/${facultyId}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Unable to retrieve borrowing records.",
    });
  }
});

module.exports = router;
