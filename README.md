# Faculty Module API — UI/UX Prototype and User Flows

## 1. Project Overview

The Faculty Module API is a REST API for managing faculty members and academic departments. The project uses Node.js, Express.js, and OpenAPI/Swagger documentation. The current API uses in-memory mock data.

The interface prototype is intended to demonstrate how users can view, create, edit, and manage faculty and department information through complete clickable workflows.

## 2. Faculty Management

### 2.1 Faculty List
**Purpose:** Display all faculty members.

**Information displayed:**
- Faculty ID
- Full name
- Department
- Position
- Email address
- Status (ACTIVE or INACTIVE)

**Available actions:**
- View Details
- Edit Faculty
- Add Faculty
- Deactivate Faculty
- Search and filter faculty records

**API:** `GET /api/v1/faculty`

### 2.2 Faculty Details
**Purpose:** Display complete information for a selected faculty member.

**Information displayed:**
- Faculty ID
- Full name
- Department name
- Position
- Email address
- Account status

**Available actions:**
- Return to Faculty List
- Edit Faculty

**API:** `GET /api/v1/faculty/{facultyId}`

### 2.3 Add Faculty
**Purpose:** Register a new faculty member.

**Form fields:**
- Full name — required
- Department — required; select an existing department
- Position — required
- Email address — required and must be valid

**Workflow:**
1. Click Add Faculty.
2. Enter the faculty information.
3. Validate the form.
4. Click Save.
5. Submit the request to the API.
6. Display a success message when creation succeeds.
7. Return to the updated Faculty List or the new faculty's details.

**API:** `POST /api/v1/faculty`

### 2.4 Edit Faculty
**Purpose:** Update an existing faculty member's information.

**Workflow:**
1. Open the Faculty List.
2. Click View Details for a faculty member.
3. Click Edit Faculty.
4. Modify the form fields.
5. Click Save Changes.
6. Submit the update request.
7. Display a success message.
8. Show the updated information.

**API:** `PUT /api/v1/faculty/{facultyId}`

### 2.5 Deactivate Faculty
**Purpose:** Change a faculty member's status to INACTIVE.

**Workflow:**
1. Click Deactivate Faculty.
2. Display a confirmation dialog.
3. Allow the user to cancel or confirm.
4. If cancelled, keep the existing status.
5. If confirmed, submit the request.
6. Update the status only after the API succeeds.
7. Display a success or error message.

**API:** `PATCH /api/v1/faculty/{facultyId}/disable`

## 3. Department Management

### 3.1 Department List
**Purpose:** Display all academic departments.

**Information displayed:**
- Department ID
- Department name
- Description

**Available actions:**
- View Department
- Add Department
- Edit Department

**API:** `GET /api/v1/departments`

### 3.2 Department Details
**Purpose:** Display the information for a selected department.

**Information displayed:**
- Department ID
- Department name
- Description

**Available actions:**
- Return to Department List
- Edit Department

**API:** `GET /api/v1/departments/{departmentId}`

### 3.3 Add Department
**Purpose:** Create a new academic department.

**Form fields:**
- Department name — required, maximum 100 characters
- Description — optional

**Workflow:**
1. Click Add Department.
2. Enter the department information.
3. Validate the form.
4. Click Save.
5. Submit the creation request.
6. Display a success message.
7. Show the updated Department List.

**API:** `POST /api/v1/departments`

### 3.4 Edit Department
**Purpose:** Update an existing department.

**Workflow:**
1. Open the Department List.
2. Select a department.
3. Click Edit Department.
4. Modify the department name or description.
5. Click Save Changes.
6. Submit the update request.
7. Display a success message.
8. Show the updated department information.

**API:** `PUT /api/v1/departments/{departmentId}`

## 4. Department and Faculty Relationship

The intended relationship is **one-to-many**:

- One department can have multiple faculty members.
- Each faculty member belongs to one department.
- The faculty record references the department using `department_id`.

**Example:**

| Department ID | Department Name |
|---|---|
| 1 | Information Technology |
| 2 | Computer Science |
| 3 | Business Administration |

A faculty member assigned to Information Technology would reference `department_id: 1`.

When adding or editing faculty, the interface should display department names in a dropdown instead of requiring users to enter department IDs manually.

**Implementation note:** The OpenAPI document describes this relationship, but the Express routes must also validate the department ID and return the related department information. The current mock-data implementation does not provide persistent database storage.

## 5. Required UI States

All main screens and forms should demonstrate the following states.

### 5.1 Loading State
- Show a loading spinner or progress indicator.
- Display a message such as “Loading faculty records…”.
- Prevent duplicate submissions while a request is in progress.
- Hide the loading indicator when the request finishes.

### 5.2 Empty State
- Show a clear message when no records exist.
- Example: “No faculty members found.”
- Provide an Add Faculty action when appropriate.
- Show a separate message when a search returns no matching results.

### 5.3 Error State
- Display an understandable message when an API request fails.
- Provide a Retry button for failed list requests.
- Handle network errors and unsuccessful HTTP responses.
- Display appropriate messages for HTTP 400, 404, and 409 responses.

### 5.4 Validation State
- Require all mandatory fields.
- Validate email format.
- Require a valid department selection.
- Display validation messages beside the relevant fields.
- Keep the user's entered information when validation fails.
- Prevent submission of invalid forms.

### 5.5 Confirmation Dialog
Display a confirmation dialog before deactivating a faculty member.

Example:

**Deactivate Faculty?**

Are you sure you want to deactivate this faculty member?

- Cancel — close the dialog without changing the status.
- Confirm — submit the deactivation request.

### 5.6 Success State
Display a success notification after the server confirms the operation.

Examples:
- “Faculty created successfully.”
- “Faculty updated successfully.”
- “Faculty deactivated successfully.”
- “Department created successfully.”
- “Department updated successfully.”

The interface must not display a success message when the request fails.

## 6. Complete Clickable Flow

Every feature must have a working interaction flow.

### Faculty Flow
Faculty List → Faculty Details → Edit Faculty → Save Changes → Success Message → Updated Details

### Add Faculty Flow
Faculty List → Add Faculty → Enter Information → Validation → Save → Success Message → Updated Faculty List

### Deactivate Faculty Flow
Faculty List → Deactivate → Confirmation Dialog → Confirm or Cancel → Updated Status or No Change

### Department Flow
Department List → Department Details → Edit Department → Save Changes → Success Message → Updated Details

### Add Department Flow
Department List → Add Department → Enter Information → Validation → Save → Success Message → Updated Department List

All navigation links, buttons, forms, dialogs, and actions must work. A static screenshot alone does not demonstrate a complete clickable flow.

## 7. Responsive Design Requirements

The main screens must work on both desktop and mobile phone widths.

### Desktop Layout
- Full navigation menu or sidebar.
- Data tables with visible column headings.
- Forms arranged in a spacious layout.
- Clearly visible action buttons.
- Details pages with readable spacing.

### Mobile Layout
- Responsive navigation.
- Forms arranged vertically.
- Buttons large enough to tap comfortably.
- Tables adapted into cards or horizontally scrollable containers.
- No unintended horizontal page overflow.
- Readable text and properly spaced form controls.

### Required Screens to Test
- Faculty List
- Faculty Details
- Add/Edit Faculty
- Department List
- Department Details
- Add/Edit Department
- Confirmation Dialog
- Validation and Error States

Test the desktop layout at a wide viewport and the phone layout at approximately 375–390 pixels wide.

## 8. API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Check API health |
| GET | `/api/v1/faculty` | Retrieve all faculty |
| GET | `/api/v1/faculty/{facultyId}` | Retrieve faculty by ID |
| POST | `/api/v1/faculty` | Create faculty |
| PUT | `/api/v1/faculty/{facultyId}` | Update faculty |
| PATCH | `/api/v1/faculty/{facultyId}/disable` | Deactivate faculty |
| GET | `/api/v1/departments` | Retrieve all departments |
| GET | `/api/v1/departments/{departmentId}` | Retrieve department by ID |
| POST | `/api/v1/departments` | Create department |
| PUT | `/api/v1/departments/{departmentId}` | Update department |

**Swagger documentation:** [http://localhost:5000/docs](http://localhost:5000/docs)

The Swagger link works when the backend is running on the same computer. Other evaluators cannot access your local server through their own computers unless the API is deployed.

## 9. Screenshots and Prototype Evidence

Add screenshots or a clickable prototype link to demonstrate the implemented features.

Recommended evidence:
1. Faculty List — desktop
2. Faculty Details — desktop
3. Edit Faculty — desktop
4. Add Faculty and validation messages
5. Faculty update success message
6. Deactivation confirmation dialog
7. Department List — desktop
8. Department Details and Edit Department
9. Loading, empty, and error states
10. Faculty and Department screens — mobile
11. Clickable prototype or deployed application link

Example Markdown for screenshots:

```markdown
### Faculty List — Desktop
![Faculty List Desktop](docs/screenshots/faculty-list-desktop.png)

### Faculty List — Mobile
![Faculty List Mobile](docs/screenshots/faculty-list-mobile.png)
```

Save your screenshots in the repository at the paths shown in the Markdown, or replace those paths with your actual screenshot filenames.

## 10. Implementation Status

Update this checklist only after testing each feature.

- [ ] Faculty list and details navigation
- [ ] Add faculty with validation
- [ ] Edit faculty and save changes
- [ ] Faculty deactivation confirmation
- [ ] Department list and details navigation
- [ ] Add department with validation
- [ ] Edit department and save changes
- [ ] Loading state
- [ ] Empty state
- [ ] Error state and retry
- [ ] Form validation state
- [ ] Confirmation dialog
- [ ] Success notifications
- [ ] Desktop layouts tested
- [ ] Mobile layouts tested
- [ ] Screenshots or prototype link added

**Current project status:** The backend API and OpenAPI/Swagger documentation are being developed using mock data. Mark the frontend workflows as complete only after the corresponding interactions have been implemented and tested.
