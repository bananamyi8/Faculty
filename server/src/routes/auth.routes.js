const router = require("express").Router();
const { register, login, me, listUsers, setRole } = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.get("/users", protect, authorize("admin"), listUsers);
router.patch("/users/:id/role", protect, authorize("admin"), setRole);

module.exports = router;