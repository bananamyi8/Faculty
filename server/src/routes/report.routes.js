const router = require("express").Router();
const c = require("../controllers/report.controller");

router.get("/summary", c.summary);

module.exports = router;
