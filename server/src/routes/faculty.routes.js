const router = require("express").Router();
const c = require("../controllers/faculty.controller");

router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", c.create);
router.put("/:id", c.update);
router.patch("/:id/disable", c.disable);
router.delete("/:id", c.remove);

module.exports = router;
