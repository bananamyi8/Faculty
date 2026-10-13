# Faculty Module — College Management System

The Faculty Module manages faculty records, including registration, information updates, retrieval, and account deactivation.

## About the Module

The Faculty Module is one of the eight modules of the College Management System. It provides API endpoints for managing faculty information and account status. Faculty records are retained for historical and administrative purposes when an employee leaves the school.

## Users

| User | What they do in this module |
|---|---|
| Student | No direct functionality specified for this module. |
| Faculty | Have their faculty information maintained in the system. |
| Staff / Admin | Register faculty members, view faculty records, update information, and deactivate accounts. |

## Features

- **Faculty Registration** — Create a new faculty record with a unique faculty ID.
- **View Faculty Records** — Retrieve all faculty members, including inactive records, or search for a faculty member by ID.
- **Update Faculty Information** — Update a faculty member's name, department, position, and email.
- **Account Deactivation** — Mark a faculty account as inactive without deleting its record.
- **Status Tracking** — Maintain the faculty account status, last updated timestamp, and deactivation timestamp.
- **Input Validation** — Validate faculty IDs, required fields, and email addresses.
- **REST API Documentation** — Document endpoints using OpenAPI 3.0 and Swagger UI.

## Part of the College Management System

This module is one of eight modules that together make up the College Management System.

| Module | This repo |
|---|---|
| Landing Page | [Add repository link] |
| Library | [Add repository link] |
| Student Portal | [Add repository link] |
| Finance | [Add repository link] |
| Faculty | This repository |
| Clinic | [Add repository link] |
| Registrar | [Add repository link] |
| Inventory | [Add repository link] |

**Integration documentation:** `docs/integration.md`

This document explains how the Faculty Module connects to the other modules of the College Management System.

## Team

| Name | Role | GitHub |
|---|---|---|
| [Full Name] | Backend | [@username] |
| [Full Name] | Frontend | [@username] |
| [Full Name] | Documentation | [@username] |

**Team responsibilities:**

- **Backend:** Owns `server/` and the API contract.
- **Frontend:** Owns `client/`.
- **Documentation:** Owns `docs/`, this README, and the instructor's handout. The handout is submitted separately and is not included in this repository.

## Tech Stack

| Part | Technology |
|---|---|
| Frontend (`client/`) | React + Vite, if used by the team |
| Backend (`server/`) | To be confirmed |
| API Documentation | OpenAPI 3.0 + Swagger UI |
| Database | Mock data; database integration is planned |

## Project Structure

```text
.
├── client/                  # Frontend application
│   └── README.md
├── server/                  # Backend API
│   ├── openapi.yaml          # API contract
│   └── README.md
├── docs/                    # Project documentation
│   ├── README.md
│   └── integration.md
├── CONTRIBUTING.md           # Team Git workflow
└── README.md                 # Project overview
```

The API contract lists the endpoints, request formats, response formats, and error responses supported by the Faculty Module.

## Getting Started

### Prerequisites

Install the tools required by your team's actual implementation:

- Git
- Node.js, if the frontend uses React + Vite
- The backend runtime and dependencies required by your chosen framework

### 1. Clone the Repository

```bash
git clone [repo-url]
cd [repo-folder]
```

Replace `[repo-url]` and `[repo-folder]` with your actual GitHub repository URL and folder name.

### 2. Run the Server

Open a terminal in the server directory:

```bash
cd server
```

Install the backend dependencies and start the server using the commands specified in `server/README.md`.

**API base URL:** `http://localhost:5000/api`

**Swagger UI:** `http://localhost:5000/docs` — available only after Swagger UI has been configured in the backend and the server is running.

### 3. Run the Client

Open another terminal in the project root:

```bash
cd client
npm install
npm run dev
```

Open the local frontend URL displayed in the terminal.

> These commands assume the client uses React + Vite and has a valid `package.json`.

## Environment Variables

Configure environment variables according to your actual backend and frontend implementation.

| Variable | Where | Example | Purpose |
|---|---|---|---|
| `PORT` | Server | `5000` | Port used by the API server, if configurable. |
| `CORS_ORIGINS` | Server | `http://localhost:5173` | Allowed frontend origins, if supported by the backend configuration. |
| `VITE_API_BASE_URL` | Client | `http://localhost:5000/api` | Base URL used by the frontend to call the API. |

Do not commit passwords, secret keys, or other sensitive values to GitHub.

## API Documentation

**Swagger UI:** `http://localhost:5000/docs`

**API contract:** `server/openapi.yaml`

The Faculty Module API includes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/faculty` | Retrieve all faculty records. |
| POST | `/api/faculty` | Register a new faculty member. |
| GET | `/api/faculty/{facultyId}` | Retrieve a faculty member by ID. |
| PUT | `/api/faculty/{facultyId}` | Update an existing faculty record. |
| PATCH | `/api/faculty/{facultyId}/disable` | Deactivate a faculty account without deleting the record. |

The API supports documented responses for successful requests and errors, including invalid input, missing records, duplicate faculty IDs, and internal server errors.

## Documentation

| Document | What's inside |
|---|---|
| Architecture | How the frontend, backend, and other system components fit together. |
| Data Model | Faculty fields, account status, and relationships. |
| Integration | How the Faculty Module connects to the other modules. |
| Design System | Colors, fonts, components, and UI rules. |
| Decisions | Reasons for the selected technologies and design choices. |

Store these documents in the `docs/` directory.

## Project Status

### Midterm

- [ ] API contract (`server/openapi.yaml`) is complete and has no validation errors.
- [ ] Every endpoint works with mock data; no database is required yet.
- [ ] Swagger UI runs at `/docs`, and **Try it out** works for every endpoint.
- [ ] README and supporting documentation are complete.
- [ ] Other requirements from the instructor are satisfied.

### Finals

- [ ] Complete the additional requirements provided by the instructor.
- [ ] Integrate the planned database, if required.
- [ ] Complete frontend and backend integration.
- [ ] Test the required workflows and API endpoints.

## Contributing

Read `CONTRIBUTING.md` for the team's branch naming conventions, commit message format, and pull request review process.

## Academic Information

Academic project for **System Architecture and Integration**.

- **School:** [School Name]
- **Semester:** [Semester]
- **School Year:** [School Year]
