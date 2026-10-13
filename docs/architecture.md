# Faculty API Architecture

## Request flow

Swagger UI or another client → Express route → faculty service → in-memory mock data → JSON response.

## Layers
- `server/routes/facultyRoutes.js`: HTTP endpoints and response codes.
- `server/services/facultyService.js`: validation and faculty business rules.
- `server/data/facultyData.js`: mock faculty records.
- `server/openapi.yaml`: API contract loaded by Swagger UI at `/docs`.

## API operations
| Operation | Endpoint |
|---|---|
| Health | `GET /api/v1/health` |
| List faculty | `GET /api/v1/faculty` |
| Create faculty | `POST /api/v1/faculty` |
| Get faculty | `GET /api/v1/faculty/{facultyId}` |
| Update faculty | `PUT /api/v1/faculty/{facultyId}` |
| Disable faculty | `PATCH /api/v1/faculty/{facultyId}/disable` |
