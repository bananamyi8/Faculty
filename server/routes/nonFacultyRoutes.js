
const express = require("express");
const router = express.Router();

const {
  getAllNonFaculty,
  getNonFacultyById,
  createNonFaculty,
  updateNonFaculty,
  deleteNonFaculty,
  searchNonFaculty
} = require("../controllers/nonFacultyController");

router.get("/", getAllNonFaculty);
router.get("/search", searchNonFaculty);
router.get("/:id", getNonFacultyById);
router.post("/", createNonFaculty);
router.put("/:id", updateNonFaculty);
router.delete("/:id", deleteNonFaculty);

module.exports = router;
