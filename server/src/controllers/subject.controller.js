const Subject = require("../models/subject.model");
const createCrud = require("./crud.factory");

module.exports = createCrud(Subject, {
  idField: "subjectId",
  label: "Subject",
  fields: ["code", "name", "department", "units"],
});
