# Models

This folder defines the data structures used by the Faculty Module.

## Responsibilities

- Define the structure of faculty records.
- Define create and update request payloads.
- Validate field types and required values.
- Keep field names consistent with `openapi.yaml`.

## Faculty Fields

The current Faculty API contract includes fields such as:

- `facultyId`
- `name`
- `department`
- `position`
- `email`
- `status`
- `updatedAt`
- `disabledAt`

The exact field requirements, data types, and allowed values must follow `openapi.yaml`.

## Important

Use the validation or modeling approach supported by your chosen backend framework.
