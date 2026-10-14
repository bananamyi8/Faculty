# Server (Backend) — Faculty and Department Modules

The REST API for the Faculty and Department Modules of the College Management System.

**Owner:** Backend member

> **Midterm requirement:** Every endpoint documented in `openapi.yaml` must be implemented and testable in Swagger UI at `/docs`. Use mock data for the midterm; a database is not required yet.

## Contents

1. [What You're Building](#1-what-youre-building)
2. [Write the API Contract First](#2-write-the-api-contract-first)
3. [Choose Your Framework](#3-choose-your-framework)
4. [Set Up the Project](#4-set-up-the-project)
5. [Folder Structure](#5-folder-structure)
6. [Mock Data](#6-mock-data-no-database-yet)
7. [Best Practices](#7-best-practices)
8. [Midterm Checklist](#8-midterm-checklist)
9. [Finals Preparation](#9-finals-preparation)

---

## 1. What You're Building

The server provides REST APIs for managing faculty members and departments. The frontend and other modules communicate with the server through HTTP requests and JSON responses.

```text
Client (Frontend)
        |
        | HTTP + JSON
        v
Faculty and Department API
        |
        v
Routes
        |
        v
Services
        |
        v
Mock Data (Midterm)
        |
        v
Database (Finals)
```

The server is the only way to access the module's data. The frontend and other modules must communicate through the API instead of accessing the data directly.

The API must use predictable URLs, request formats, response formats, and HTTP status codes.

### Faculty Module

The Faculty Module manages faculty records, including retrieving, creating, updating, and deactivating faculty accounts.

### Department Module

The Department Module manages department records, including retrieving, creating, and updating departments.

Faculty records may reference departments through a department ID, according to the agreed data model and API contract.

## 2. Write the API Contract First

Before implementing the backend, define every endpoint in `openapi.yaml`.

**API contract file:** `server/openapi.yaml`

The contract describes the available endpoints, request bodies, response schemas, status codes, and error responses.

### Faculty API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/faculty` | Retrieve all faculty records |
| POST | `/api/v1/faculty` | Create a faculty record |
| GET | `/api/v1/faculty/{facultyId}` | Retrieve a faculty record by ID |
| PUT | `/api/v1/faculty/{facultyId}` | Update a faculty record |
| PATCH | `/api/v1/faculty/{facultyId}/disable` | Deactivate a faculty account |

### Department API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/departments` | Retrieve all departments |
| GET | `/api/v1/departments/{departmentId}` | Retrieve a department by ID |
| POST | `/api/v1/departments` | Create a department |
| PUT | `/api/v1/departments/{departmentId}` | Update a department |

**Important:** The original Faculty API contract may use `/api` as its base path, while the project-wide backend instructions require `/api/v1`. Confirm the required prefix with your team. Update `openapi.yaml`, the backend routes, and the frontend configuration together. Do not use inconsistent prefixes.

For more guidance, see `API-CONTRACT.md`.

### Suggested Faculty Fields

The final field names and types must match the schemas in `openapi.yaml`.

- `facultyId`
- `name`
- `departmentId`
- `position`
- `email`
- `status`
- `updatedAt`
- `disabledAt`

### Suggested Department Fields

The final field names and types must also match `openapi.yaml`.

- `departmentId`
- `departmentName`
- `description`
- `status`

Use `camelCase` for JSON field names. Do not introduce fields that conflict with the agreed API contract.

## 3. Choose Your Framework

Choose a backend framework that your team can work with. Record your decision in `docs/decisions/0001-backend-framework.md`.

| Framework | Language | Swagger UI |
|---|---|---|
| Express | JavaScript | `swagger-ui-express` |
| FastAPI | Python | Built-in `/docs` |
| Flask | Python | `flask-swagger-ui` |
| ASP.NET Core | C# | Swashbuckle |
| NestJS | TypeScript | `@nestjs/swagger` |
| Spring Boot | Java | Springdoc OpenAPI |
| Laravel | PHP | Scramble or L5-Swagger |
| Django REST Framework | Python | `drf-spectacular` |

Every group must make Swagger UI available at `/docs` and follow the agreed API prefix.

For example, if your server runs on port `5000`, open:

`http://localhost:5000/docs`

Swagger UI must be configured in your chosen framework. Having `openapi.yaml` alone does not automatically create the `/docs` page.

## 4. Set Up the Project

Create and configure the backend inside the `server/` directory.

For a Node.js and Express project, the basic setup includes:

- `package.json` for project metadata, dependencies, and scripts.
- `package-lock.json` for dependency version consistency.
- `openapi.yaml` for the API contract.
- `src/index.js` for starting the server.
- `.env.example` for documenting required environment variables.

After setup, make sure the server starts successfully and that Swagger UI displays the Faculty and Department API contracts.

Example commands for an Express project:

```bash
cd server
npm install
npm run dev
```

Run these commands only after the appropriate `package.json` scripts and source files have been created.

## 5. Folder Structure

Use the following structure for the Express backend:

```text
server/
├── README.md
├── openapi.yaml
├── API-CONTRACT.md
├── .env.example
├── package.json
├── package-lock.json
└── src/
    ├── routes/
    │   ├── faculty.routes.js
    │   └── department.routes.js
    ├── services/
    │   ├── faculty.service.js
    │   └── department.service.js
    ├── data/
    │   ├── faculty.repository.js
    │   └── department.repository.js
    ├── models/
    │   ├── faculty.model.js
    │   └── department.model.js
    ├── middleware/
    │   └── error-handler.js
    ├── config/
    │   └── config.js
    └── index.js
```

The filenames above are examples for an Express application. Other frameworks may use different filenames and conventions.

Each folder should have a short README explaining its purpose.

### Responsibilities of Each Layer

| Layer | Responsibility |
|---|---|
| `routes/` | Maps HTTP methods and URLs to handlers |
| `services/` | Contains business rules and validation logic |
| `data/` | Stores and retrieves mock faculty and department records |
| `models/` | Defines request and response data shapes |
| `middleware/` | Handles errors, logging, and shared request processing |
| `config/` | Reads environment variables and application settings |
| `index.js` | Starts the server and registers routes |

**Rule:** Requests should flow through `routes → services → data`.

Routes must not access mock data directly. This separation makes it easier to replace in-memory data with a real database during the finals.

## 6. Mock Data (No Database Yet)

For the midterm, both the Faculty and Department APIs must work using mock data stored in memory. A database is not required yet.

### 6.1 Faculty Mock Data

Store faculty data in `src/data/faculty.repository.js`.

Prepare **5–10 realistic faculty records** that follow the schemas in `openapi.yaml`.

Example:

```javascript
const faculty = [
  {
    facultyId: 1,
    name: "Maria Santos",
    departmentId: 1,
    position: "Instructor",
    email: "maria.santos@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-01T08:00:00Z",
    disabledAt: null
  },
  {
    facultyId: 2,
    name: "Jose Reyes",
    departmentId: 2,
    position: "Assistant Professor",
    email: "jose.reyes@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-02T08:00:00Z",
    disabledAt: null
  }
];

module.exports = faculty;
```

This is only a sample of two records. Add enough records to meet the 5–10-record requirement.

### 6.2 Department Mock Data

Store department data in `src/data/department.repository.js`.

Prepare realistic department records that follow the schemas in `openapi.yaml`.

Example:

```javascript
const departments = [
  {
    departmentId: 1,
    departmentName: "Information Technology",
    description: "Information technology and computing programs",
    status: "ACTIVE"
  },
  {
    departmentId: 2,
    departmentName: "Computer Science",
    description: "Computer science and software development programs",
    status: "ACTIVE"
  },
  {
    departmentId: 3,
    departmentName: "Business Administration",
    description: "Business and management programs",
    status: "ACTIVE"
  }
];

module.exports = departments;
```

These are sample records. Adjust the fields to match the actual API contract.

### 6.3 Expected Faculty API Behavior

- **GET:** Reads faculty records from the mock data.
- **POST:** Creates a faculty record, generates its ID and timestamps when required, and returns `201 Created`.
- **PUT:** Updates an existing faculty record.
- **PATCH:** Deactivates a faculty account without deleting its history.
- **Invalid input:** Returns `400 Bad Request`.
- **Unknown faculty ID:** Returns `404 Not Found`.

The disable endpoint should retain the faculty record and set its status to `INACTIVE`. It should also record the deactivation timestamp according to the API contract.

### 6.4 Expected Department API Behavior

- **GET:** Returns all department records.
- **GET by ID:** Returns the requested department.
- **POST:** Creates a department, generates its ID when required, and returns `201 Created`.
- **PUT:** Updates an existing department.
- **Invalid input:** Returns `400 Bad Request`.
- **Unknown department ID:** Returns `404 Not Found`.

Both modules must follow the response formats, status codes, and error-handling rules defined in `API-CONTRACT.md`.

Mock data resets when the server restarts. This is acceptable for the midterm.

### 6.5 Relationship Between Faculty and Department

The Faculty Module and Department Module should use consistent department identifiers.

For example:

```text
Department
  departmentId: 1
  departmentName: Information Technology
           |
           | departmentId
           v
Faculty
  facultyId: 1
  name: Maria Santos
  departmentId: 1
```

A faculty record can reference a department through `departmentId`, provided that this relationship is defined in the agreed schema.

The API should validate department references when required by the contract. Do not allow invalid references if the agreed business rules require a valid department.

## 7. Best Practices

1. **Follow `openapi.yaml`.** Use the exact paths, field names, response formats, and status codes defined in the contract.
2. **Keep routes thin.** Routes should call services instead of containing all the business logic.
3. **Validate all inputs.** Validate request bodies, path parameters, and query parameters.
4. **Centralize error handling.** Use middleware or your framework's equivalent. Return Problem Details JSON as specified in `API-CONTRACT.md`, and never expose stack traces to clients.
5. **Use appropriate status codes.** Follow the agreed API contract.
6. **Use environment variables.** Document configuration in `.env.example`; do not commit secrets or your actual `.env` file.
7. **Use camelCase for JSON fields.** Examples: `facultyId`, `departmentId`, `updatedAt`, and `disabledAt`.
8. **Configure CORS.** Allow only the approved frontend and browser-based module origins.
9. **Log requests and errors.** Console logs help identify problems during testing.
10. **Commit dependency files.** Include the appropriate dependency lockfile or project file.
11. **Test every endpoint.** Use Swagger UI's **Try it out** feature, including error cases.
12. **Keep documentation synchronized.** If the API changes, update `openapi.yaml` and inform the frontend member.
13. **Keep the modules consistent.** Faculty records and department records must use the agreed relationship and field names.
14. **Use pull requests.** Follow the team's Git workflow and request teammate review before merging changes into `main`.

## 8. Midterm Checklist

### General Backend

- [ ] `openapi.yaml` lists every required endpoint, schema, example, and error response.
- [ ] `openapi.yaml` passes Swagger Editor validation or `npx @redocly/cli lint openapi.yaml`.
- [ ] The frontend member and dependent groups have reviewed the API contract.
- [ ] Every endpoint is implemented and returns data in the correct format.
- [ ] Swagger UI is accessible at `http://localhost:<port>/docs`.
- [ ] The **Try it out** feature works for every endpoint.
- [ ] Invalid input returns `400 Bad Request` where specified.
- [ ] Unknown IDs return `404 Not Found` where specified.
- [ ] Errors follow the Problem Details format defined in `API-CONTRACT.md`.
- [ ] `GET /api/v1/health` returns `{"status":"ok"}`.
- [ ] A teammate can start the server using the README instructions.
- [ ] `.env.example` is committed and `.env` is excluded from Git.
- [ ] Dependency files are committed.
- [ ] The backend framework decision is documented.

### Faculty Module

- [ ] Faculty API endpoints are documented in `openapi.yaml`.
- [ ] GET retrieves all faculty records.
- [ ] GET by ID retrieves a faculty record.
- [ ] POST creates a faculty record.
- [ ] PUT updates an existing faculty record.
- [ ] PATCH deactivates a faculty account without deleting its history.
- [ ] Faculty mock data contains 5–10 realistic records.
- [ ] Faculty API endpoints are tested in Swagger UI.

### Department Module

- [ ] Department API endpoints are documented in `openapi.yaml`.
- [ ] GET retrieves all departments.
- [ ] GET by ID retrieves a department by ID.
- [ ] POST creates a department.
- [ ] PUT updates an existing department.
- [ ] Department mock data is available and follows the agreed schema.
- [ ] Department endpoints are tested in Swagger UI.
- [ ] Invalid input and unknown department IDs return the required error responses.
- [ ] Faculty and Department field names are consistent across the API contract and frontend.
- [ ] The department relationship follows the agreed data model.

**Note:** The health endpoint is a project-wide requirement. Add it to `openapi.yaml` and implement it if it is not already present.

## 9. Finals Preparation

Keep the routes, services, models, and repositories organized so the mock-data layer can later be replaced with a real database implementation with minimal changes to the rest of the backend.

During the finals, the Faculty and Department modules should use the agreed database schema and preserve the API contract wherever possible. Update the documentation and coordinate any changes with the frontend member and other dependent groups.
