function validateFaculty(data) {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push("Name is required.");
  }

  if (!data.department || !data.department.trim()) {
    errors.push("Department is required.");
  }

  if (!data.position || !data.position.trim()) {
    errors.push("Position is required.");
  }

  if (!data.email || !data.email.trim()) {
    errors.push("Email is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
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