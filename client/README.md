# Client (Frontend)

The user interface for the Faculty Module API. This frontend allows users to view, add, edit, and manage faculty members and departments.

**Owner:** Frontend Member

> ⚠️ **Before running a project generator:** If this folder already contains `README.md` or `.env.example`, move them temporarily outside `client/` before running the generator. Move them back afterward and keep this README.

## 1. Choose Your Framework

This project uses **React with Vite** for the frontend.

| Task | Command |
|---|---|
| Create the React project | `npm create vite@latest . -- --template react` |
| Install dependencies | `npm install` |
| Start the frontend | `npm run dev` |
| Default URL | `http://localhost:5173` |

Run these commands inside the `client/` folder.

If the project has already been created, do not run the generator again. Just install the dependencies and start the application.

## 2. Folder Structure

Organize the frontend files as follows:

```text
client/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── FacultyForm.jsx
│   │   ├── FacultyTable.jsx
│   │   ├── DepartmentForm.jsx
│   │   └── DepartmentTable.jsx
│   ├── pages/
│   │   ├── FacultyPage.jsx
│   │   └── DepartmentPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── facultyService.js
│   │   └── departmentService.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

Create only the folders and files needed by the actual implementation.

## 3. Connecting to the Backend

The frontend communicates with the Faculty Module API through HTTP requests.

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **API documentation:** `http://localhost:5000/docs`
- **Backend health check:** `http://localhost:5000/api/v1/health`
- **Faculty endpoints:** `/api/v1/faculty`
- **Department endpoints:** `/api/v1/departments`

The backend must be running before you test requests against the real API.

### Environment variable

Create a `.env` file inside `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Create `.env.example` with the same variable name:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

The `.env` file is for your local configuration. Commit `.env.example`, but do not commit `.env`.

### API service

Create `src/services/api.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.detail ||
      body?.title ||
      body?.message ||
      `Request failed: ${response.status}`
    );
  }

  return body;
}
```

### Faculty service

Create `src/services/facultyService.js`:

```javascript
import { api } from "./api";

export const listFaculty = () =>
  api("/faculty");

export const getFaculty = (facultyId) =>
  api(`/faculty/${facultyId}`);

export const createFaculty = (data) =>
  api("/faculty", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateFaculty = (facultyId, data) =>
  api(`/faculty/${facultyId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const disableFaculty = (facultyId) =>
  api(`/faculty/${facultyId}/disable`, {
    method: "PATCH",
  });
```

### Department service

Create `src/services/departmentService.js`:

```javascript
import { api } from "./api";

export const listDepartments = () =>
  api("/departments");

export const getDepartment = (departmentId) =>
  api(`/departments/${departmentId}`);

export const createDepartment = (data) =>
  api("/departments", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDepartment = (departmentId, data) =>
  api(`/departments/${departmentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
```

> **Important:** These service functions assume the backend implements the listed routes and accepts the corresponding request bodies. Match the payloads and response formats to `server/openapi.yaml` and the actual backend implementation.

## 4. Faculty Module Features

The Faculty page should provide the following user flows:

| Feature | Description | API Method |
|---|---|---|
| View faculty | Display the list of faculty members | GET `/faculty` |
| View details | Display one faculty member's information | GET `/faculty/{facultyId}` |
| Add faculty | Submit a new faculty member | POST `/faculty` |
| Edit faculty | Update faculty information | PUT `/faculty/{facultyId}` |
| Disable faculty | Mark a faculty member as inactive | PATCH `/faculty/{facultyId}/disable` |

### Faculty fields

The form should follow the API contract. Based on the current proposed contract, the fields are:

- `name` — faculty member's full name
- `department_id` — ID of the associated department
- `position` — faculty position
- `email` — faculty email address

The department field should use a dropdown populated from the Department API rather than a manually typed department name.

## 5. Department Module Features

The Department page should provide the following user flows:

| Feature | Description | API Method |
|---|---|---|
| View departments | Display all departments | GET `/departments` |
| View details | Display one department | GET `/departments/{departmentId}` |
| Add department | Create a department | POST `/departments` |
| Edit department | Update department information | PUT `/departments/{departmentId}` |

### Department fields

- `department_name` — department name
- `description` — short description of the department

### Faculty–Department relationship

A department can have multiple faculty members. Each faculty member should reference a department through `department_id`.

The frontend should load departments for the faculty form and display the department name wherever faculty details are shown.

The backend must enforce this relationship and return data consistent with the API contract.

## 6. Working Before the Backend Is Ready

The frontend can be developed independently using mock data or a mock API.

If you want to use Stoplight Prism, install or run it from the project root where the backend OpenAPI contract is available:

```bash
npx @stoplight/prism-cli mock server/openapi.yaml
```

This assumes the contract is located at `server/openapi.yaml` and that Prism can find the specification.

The mock server normally runs at:

`http://127.0.0.1:4010`

For this setup, configure `client/.env` as:

```env
VITE_API_BASE_URL=http://127.0.0.1:4010
```

The base URL does not include `/api/v1` because the mock server uses the paths defined in the OpenAPI document. Verify the actual paths and port printed by Prism before testing.

When the real backend is ready, change the base URL to:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Restart Vite after changing environment variables.

## 7. User Interface States

Every page that loads data should handle these states:

1. **Loading:** Show a loading indicator while waiting for the API.
2. **Success:** Display the returned faculty or department records.
3. **Empty:** Show a message such as "No faculty members found."
4. **Error:** Show a helpful error message and a "Try Again" button.

Forms should also handle:

- Required-field validation
- Invalid email addresses
- Duplicate faculty emails or department names
- Server validation errors
- Success messages after saving
- Confirmation before disabling a faculty member

Do not display a success message until the API request succeeds.

## 8. Responsive Design and Accessibility

The frontend should work on desktop and mobile screens.

- Use a responsive layout for tables and forms.
- Test at approximately 375px mobile width and desktop width.
- Provide labels for all form inputs.
- Use readable colors and sufficient contrast.
- Provide meaningful text for buttons and error messages.
- Support keyboard navigation.
- Show status labels clearly, such as `ACTIVE` and `INACTIVE`.
- Prevent destructive actions from happening without confirmation.

## 9. CORS Configuration

If the browser reports a CORS error, ask the backend member to allow the frontend's origin.

For local Vite development, the origin is usually:

```text
http://localhost:5173
```

The backend should configure `CORS_ORIGINS` according to its environment configuration. The frontend URL and backend CORS configuration must match.

## 10. Running the Frontend

Open a terminal in the `client/` directory and run:

```bash
npm install
npm run dev
```

Open the URL shown by Vite, usually:

`http://localhost:5173`

Run the backend separately and verify the API using:

`http://localhost:5000/docs`

If the backend uses a different port, update `VITE_API_BASE_URL` accordingly.

## 11. GitHub Checklist

Before pushing your changes, confirm that:

- [ ] `README.md` explains how to install and run the frontend.
- [ ] `.env.example` lists every environment variable used by the client.
- [ ] `.env` is excluded from Git.
- [ ] `package.json` and `package-lock.json` are committed.
- [ ] Faculty list, details, add, edit, and disable flows are implemented.
- [ ] Department list, details, add, and edit flows are implemented.
- [ ] Forms display validation and server errors.
- [ ] Loading, empty, success, and error states are implemented.
- [ ] The frontend uses API service functions rather than calling `fetch()` directly inside components.
- [ ] The app works at desktop and mobile widths.
- [ ] The README instructions work from a fresh clone.

### Commit and push

From the repository root, run:

```bash
git add client
git commit -m "Add Faculty Module frontend documentation"
git push origin main
```

If your repository uses a different branch name, replace `main` with that branch.

---

**Note:** This README documents the intended frontend structure and API integration. It does not mean the React pages or the Faculty–Department relationship are already implemented. Confirm that the actual backend routes match the documented API before testing the complete application.
