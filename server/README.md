# Server (Backend) — Faculty Module

The REST API for the Faculty Module of the College Management System.

**Owner:** Backend member

> **Midterm requirement:** Every endpoint in `openapi.yaml` must be implemented and testable in Swagger UI at `/docs`. Use mock data for the midterm; a database is not required yet.

## Contents

1. [What You're Building](#1-what-youre-building)
2. [Write the API Contract First](#2-write-the-api-contract-first)
3. [Choose Your Framework](#3-choose-your-framework)
4. [Set Up the Project](#4-set-up-the-project)
5. [Folder Structure](#5-folder-structure)
6. [Mock Data](#6-mock-data-no-database-yet)
7. [Best Practices](#7-best-practices)
8. [Midterm Checklist](#8-midterm-checklist)

## 1. What You're Building

The Faculty Module server provides a REST API that the frontend and other modules can use to access faculty information.

```text
Client (Frontend)
        |
        | HTTP + JSON
        v
Server (Faculty API)
        |
        v
Mock Data (Midterm)
        |
        v
Database (Finals)
```

Your server is the only way to access the module's data. The frontend and other modules must communicate through the API instead of accessing the data directly.

The API must use predictable URLs, request formats, response formats, and HTTP status codes.

## 2. Write the API Contract First

Before implementing the backend, define every endpoint in `openapi.yaml`.

**API contract file:** `server/openapi.yaml`

The contract describes the available endpoints, request bodies, response schemas, status codes, and error responses.

For the current Faculty Module, the contract includes:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/faculty` | Retrieve all faculty records |
| POST | `/api/faculty` | Create a faculty record |
| GET | `/api/faculty/{facultyId}` | Retrieve a faculty record by ID |
| PUT | `/api/faculty/{facultyId}` | Update a faculty record |
| PATCH | `/api/faculty/{facultyId}/disable` | Deactivate a faculty account |

**Important:** The existing Faculty API contract uses `/api` as its base path. The project-wide backend instructions require `/api/v1`. Confirm the required prefix with your team, then update `openapi.yaml`, the backend routes, and the frontend configuration together. Do not use inconsistent prefixes.

For more guidance, see `API-CONTRACT.md`.

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
| Django REST Framework | Python | drf-spectacular |

Every group must make Swagger UI available at `/docs` and follow the agreed API prefix.

For example, if your server runs on port `5000`, open:

`http://localhost:5000/docs`

Swagger UI must be configured in your chosen framework. Having `openapi.yaml` alone does not automatically create the `/docs` page.

## 4. Set Up the Project

Create and configure your backend inside the `server/` directory.

Choose the setup instructions that match your framework:

- Node.js + Express
- Python + FastAPI
- Python + Flask
- C# + ASP.NET Core
- Another approved backend framework

After setup, make sure the server starts successfully and that Swagger UI displays the Faculty API contract.

## 5. Folder Structure

Use this structure for the backend:

```text
server/
├── openapi.yaml
├── API-CONTRACT.md
├── .env.example
├── package.json                 # For Node.js projects
├── package-lock.json            # For Node.js projects
└── src/
    ├── routes/
    │   └── faculty.routes.js
    ├── services/
    │   └── faculty.service.js
    ├── data/
    │   └── faculty.repository.js
    ├── models/
    │   └── faculty.model.js
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
| `data/` | Stores and retrieves mock faculty records |
| `models/` | Defines request and response data shapes |
| `middleware/` | Handles errors, logging, and other shared request processing |
| `config/` | Reads environment variables and application settings |
| `index.js` | Starts the server and registers routes |

**Rule:** Requests should flow through `routes → services → data`.

Routes must not access mock data directly. This separation makes it easier to replace in-memory data with a database during the finals.

## 6. Mock Data (No Database Yet)

For the midterm, the Faculty API must work using mock data stored in memory. A database is not required yet.

Store the data in `src/data/` and prepare **5–10 realistic faculty records** that follow the schemas in `openapi.yaml`.

Example:

```javascript
const faculty = [
  {
    facultyId: 1,
    name: "Maria Santos",
    department: "Information Technology",
    position: "Instructor",
    email: "maria.santos@example.com",
    status: "ACTIVE",
    updatedAt: "2026-10-01T08:00:00Z",
    disabledAt: null
  },
  {
    facultyId: 2,
    name: "Jose Reyes",
    department: "Computer Science",
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

### Expected Behavior

- **GET:** Reads faculty records from the mock data.
- **POST:** Creates a faculty record, generates its ID and timestamps, and returns `201 Created`.
- **PUT:** Updates an existing faculty record.
- **PATCH:** Deactivates a faculty account without deleting its history.
- **Invalid input:** Returns `400 Bad Request`.
- **Unknown faculty ID:** Returns `404 Not Found`.

The Faculty Module's disable endpoint should retain the record and set its status to `INACTIVE`. It should also record the deactivation timestamp according to the API contract.

Mock data resets when the server restarts. This is acceptable for the midterm.

## 7. Best Practices

1. **Follow `openapi.yaml`.** Use the exact paths, field names, response formats, and status codes defined in the contract.
2. **Keep routes thin.** Routes should call services instead of containing all the business logic.
3. **Validate all inputs.** Validate request bodies, path parameters, and query parameters.
4. **Centralize error handling.** Use middleware or your framework's equivalent. Return Problem Details JSON as specified in `API-CONTRACT.md`, and never expose stack traces to clients.
5. **Use appropriate status codes.** Follow the agreed API contract.
6. **Use environment variables.** Document configuration in `.env.example`; do not commit secrets or your actual `.env` file.
7. **Use camelCase for JSON fields.** Examples: `facultyId`, `updatedAt`, and `disabledAt`.
8. **Configure CORS.** Allow only the approved frontend and browser-based module origins.
9. **Log requests and errors.** Console logs help identify problems during testing.
10. **Commit dependency files.** Include the appropriate dependency lockfile or project file.
11. **Test every endpoint.** Use Swagger UI's **Try it out** feature, including error cases.
12. **Keep documentation synchronized.** If the API changes, update `openapi.yaml` and inform the frontend member.

## 8. Midterm Checklist

Before submitting, verify each item:

- [ ] `openapi.yaml` lists every required endpoint, schema, example, and error response.
- [ ] `openapi.yaml` passes Swagger Editor validation or `npx @redocly/cli lint openapi.yaml`.
- [ ] The frontend member and any dependent groups have reviewed the contract.
- [ ] Every endpoint is implemented and returns data in the correct format.
- [ ] Mock data contains 5–10 realistic faculty records.
- [ ] Swagger UI is accessible at `http://localhost:<port>/docs`.
- [ ] The **Try it out** feature works for every endpoint.
- [ ] Invalid input returns `400 Bad Request`.
- [ ] Unknown IDs return `404 Not Found`.
- [ ] Errors follow the Problem Details format defined in `API-CONTRACT.md`.
- [ ] `GET /api/v1/health` returns `{"status":"ok"}`.
- [ ] A teammate can start the server using the root README's instructions.
- [ ] `.env.example` is committed and `.env` is excluded from Git.
- [ ] Dependency files are committed.
- [ ] The backend framework decision is documented.

**Note:** The health endpoint is a project-wide requirement from the backend instructions. Add it to `openapi.yaml` and implement it if it is not already present.

---

**Finals preparation:** Keep the routes, services, and models organized so the mock-data layer can later be replaced by a real database implementation with minimal changes to the rest of the backend.
