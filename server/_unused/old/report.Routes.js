const router = require('express').Router();
const c = require('../controllers/reportController');

router.get('/summary', c.summary);
router.get('/faculty-by-department', c.facultyByDepartment);
router.get('/non-faculty-by-department', c.nonFacultyByDepartment);
router.get('/schedules-per-faculty', c.schedulesPerFaculty);

module.exports = router;