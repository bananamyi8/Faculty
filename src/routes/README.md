# Routes

This folder contains the HTTP routes for the Faculty API.

## Responsibilities

- Define endpoint paths and HTTP methods.
- Read request bodies and path parameters.
- Call the appropriate service functions.
- Return the correct response and HTTP status code.
- Follow the API contract defined in `openapi.yaml`.

## Faculty Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/faculty` | Retrieve all faculty records |
| POST | `/api/v1/faculty` | Create a faculty record |
| GET | `/api/v1/faculty/{facultyId}` | Retrieve a faculty record by ID |
| PUT | `/api/v1/faculty/{facultyId}` | Update a faculty record |
| PATCH | `/api/v1/faculty/{facultyId}/disable` | Deactivate a faculty account |

## Important

Keep route handlers thin. Routes should call services instead of containing business logic or directly accessing mock data.

Use the exact paths specified in the finalized `openapi.yaml`.
