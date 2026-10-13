## What does this PR do?

- Adds or updates the Faculty Module API.
- Implements faculty and department routes for listing, viewing, creating, and updating records.
- Updates project documentation where necessary.

## Why?

This change helps implement and maintain the Faculty Module API. It improves the organization of faculty and department data and keeps the implementation consistent with the API documentation.

## How to test it

1. Install the backend dependencies:
   ```bash
   npm install
   ```
2. Start the backend:
   ```bash
   npm start
   ```
3. Open Swagger UI:
   `http://localhost:5000/docs`
4. Test the faculty endpoints:
   - `GET /api/v1/faculty`
   - `GET /api/v1/faculty/{facultyId}`
   - `POST /api/v1/faculty`
   - `PUT /api/v1/faculty/{facultyId}`
   - `PATCH /api/v1/faculty/{facultyId}/disable`
5. Test the department endpoints:
   - `GET /api/v1/departments`
   - `GET /api/v1/departments/{departmentId}`
   - `POST /api/v1/departments`
   - `PUT /api/v1/departments/{departmentId}`
6. Verify that valid requests return the expected responses and invalid requests return appropriate errors.

## Screenshots

Add screenshots showing:
- Swagger UI with the available API endpoints.
- Successful faculty API requests and responses.
- Successful department API requests and responses.
- Any relevant validation or error responses.

## Checklist

- [ ] I ran it on my computer and it works.
- [ ] If I added or changed an endpoint, I updated `server/openapi.yaml` first.
- [ ] I updated the documentation affected by this change, or no documentation changes were needed.
- [ ] I did not commit any `.env` files, passwords, or keys.
- [ ] I tested the affected API endpoints.
- [ ] I checked that the changes do not break existing functionality.