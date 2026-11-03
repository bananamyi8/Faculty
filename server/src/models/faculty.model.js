function validateFaculty(data) {
  const errors = [];

  if (typeof data.name !== "string" || !data.name.trim()) {
    errors.push("Name is required.");
  }
  if (typeof data.department !== "string" || !data.department.trim()) {
    errors.push("Department is required.");
  }
  if (typeof data.position !== "string" || !data.position.trim()) {
    errors.push("Position is required.");
  }
  if (
    typeof data.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
  ) {
    errors.push("A valid email address is required.");
  }

  return errors;
}

function normalizeFaculty(data) {
  return {
    name: data.name.trim(),
    department: data.department.trim(),
    position: data.position.trim(),
    email: data.email.trim().toLowerCase()
  };
}

module.exports = { validateFaculty, normalizeFaculty };
