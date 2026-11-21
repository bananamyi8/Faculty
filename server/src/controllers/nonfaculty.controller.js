const NonFaculty = require("../models/nonfaculty.model");
const createCrud = require("./crud.factory");

module.exports = createCrud(NonFaculty, {
  idField: "nonFacultyId",
  label: "Non-faculty record",
  fields: ["employeeId", "name", "department", "position", "email", "status"],
});
