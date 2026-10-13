
const express = require("express");
const router = express.Router();

let departments = [
  {
    department_id: 1,
    department_name: "Information Technology",
    description: "Department for IT and software development programs"
  },
  {
    department_id: 2,
    department_name: "Computer Science",
    description: "Department for computing and computer science programs"
  },
  {
    department_id: 3,
    department_name: "Business Administration",
    description: "Department for business and management programs"
  }
];

let nextId = 4;

// GET all departments
router.get("/", (req, res) => {
  res.status(200).json({
    count: departments.length,
    data: departments
  });
});

// GET one department by ID
router.get("/:departmentId", (req, res) => {
  const departmentId = Number(req.params.departmentId);

  const department = departments.find(
    (item) => item.department_id === departmentId
  );

  if (!department) {
    return res.status(404).json({
      status: 404,
      title: "Department Not Found",
      detail: "The requested department does not exist."
    });
  }

  res.status(200).json({ data: department });
});

// POST create a department
router.post("/", (req, res) => {
  const { department_name, description } = req.body;

  if (
    typeof department_name !== "string" ||
    !department_name.trim()
  ) {
    return res.status(400).json({
      status: 400,
      title: "Bad Request",
      detail: "department_name is required."
    });
  }

  const duplicate = departments.some(
    (item) =>
      item.department_name.toLowerCase() ===
      department_name.trim().toLowerCase()
  );

  if (duplicate) {
    return res.status(409).json({
      status: 409,
      title: "Conflict",
      detail: "This department already exists."
    });
  }

  const newDepartment = {
    department_id: nextId++,
    department_name: department_name.trim(),
    description:
      typeof description === "string" ? description.trim() : ""
  };

  departments.push(newDepartment);

  res.status(201).json({
    message: "Department created successfully.",
    data: newDepartment
  });
});

// PUT update a department
router.put("/:departmentId", (req, res) => {
  const departmentId = Number(req.params.departmentId);

  const department = departments.find(
    (item) => item.department_id === departmentId
  );

  if (!department) {
    return res.status(404).json({
      status: 404,
      title: "Department Not Found",
      detail: "The requested department does not exist."
    });
  }

  const { department_name, description } = req.body;

  if (
    typeof department_name !== "string" ||
    !department_name.trim()
  ) {
    return res.status(400).json({
      status: 400,
      title: "Bad Request",
      detail: "department_name is required."
    });
  }

  const duplicate = departments.some(
    (item) =>
      item.department_id !== departmentId &&
      item.department_name.toLowerCase() ===
      department_name.trim().toLowerCase()
  );

  if (duplicate) {
    return res.status(409).json({
      status: 409,
      title: "Conflict",
      detail: "Another department already uses this name."
    });
  }

  department.department_name = department_name.trim();
  department.description =
    typeof description === "string" ? description.trim() : "";

  res.status(200).json({
    message: "Department updated successfully.",
    data: department
  });
});

module.exports = router;
