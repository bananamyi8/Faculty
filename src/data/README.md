# Data Layer

This folder stores and manages mock faculty records for the midterm.

## Responsibilities

- Provide 5–10 realistic faculty records.
- Retrieve all faculty records.
- Find a faculty record by ID.
- Add new faculty records.
- Update existing records.
- Deactivate records while retaining their history.
- Generate IDs and timestamps according to `openapi.yaml`.

## Example File

`faculty.repository.js`

## Mock Data

Use an in-memory list or a JSON file loaded when the server starts. No database is required for the midterm.

In-memory records reset when the server restarts. At finals, this layer can be replaced with database operations while preserving the routes and services.
