
const API_URL = `${import.meta.env.VITE_API_URL}/faculty`;

// Get all faculty members
export async function getFaculty() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Unable to load faculty records.");
  }

  return response.json();
}

// Get one faculty member
export async function getFacultyById(facultyId) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(facultyId)}`
  );

  if (!response.ok) {
    throw new Error("Faculty member not found.");
  }

  return response.json();
}

// Add faculty member
export async function createFaculty(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to create faculty.");
  }

  return result;
}

// Update faculty member
export async function updateFaculty(facultyId, data) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(facultyId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to update faculty.");
  }

  return result;
}

// Deactivate faculty member
export async function deactivateFaculty(facultyId) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(facultyId)}/disable`,
    {
      method: "PATCH",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to deactivate faculty.");
  }

  return result;
}
