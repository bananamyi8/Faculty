const Schedule = require("../models/schedule.model");
const createCrud = require("./crud.factory");

module.exports = createCrud(Schedule, {
  idField: "scheduleId",
  label: "Schedule",
  fields: ["subject", "faculty", "section", "day", "startTime", "endTime", "room"],
});
