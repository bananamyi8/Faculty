const Faculty = require("../models/faculty.model");
const NonFaculty = require("../models/nonfaculty.model");
const Department = require("../models/department.model");
const Subject = require("../models/subject.model");
const Schedule = require("../models/schedule.model");
const { sendError } = require("../utils/http");

async function groupBy(Model, field) {
  const rows = await Model.aggregate([
    { $group: { _id: `$${field}`, total: { $sum: 1 } } },
    { $sort: { total: -1, _id: 1 } },
  ]);
  return rows.map((r) => ({ label: r._id || "Unassigned", total: r.total }));
}

exports.summary = async (req, res) => {
  try {
    const [
      faculty, facultyActive, nonFaculty, nonFacultyActive,
      departments, subjects, schedules,
      facultyByDepartment, nonFacultyByDepartment, subjectsByDepartment, schedulesByDay,
    ] = await Promise.all([
      Faculty.countDocuments(),
      Faculty.countDocuments({ status: "ACTIVE" }),
      NonFaculty.countDocuments(),
      NonFaculty.countDocuments({ status: "ACTIVE" }),
      Department.countDocuments(),
      Subject.countDocuments(),
      Schedule.countDocuments(),
      groupBy(Faculty, "department"),
      groupBy(NonFaculty, "department"),
      groupBy(Subject, "department"),
      groupBy(Schedule, "day"),
    ]);

    res.json({
      totals: {
        faculty, facultyActive, facultyInactive: faculty - facultyActive,
        nonFaculty, nonFacultyActive, nonFacultyInactive: nonFaculty - nonFacultyActive,
        departments, subjects, schedules,
      },
      facultyByDepartment,
      nonFacultyByDepartment,
      subjectsByDepartment,
      schedulesByDay,
    });
  } catch (e) { sendError(res, e); }
};
