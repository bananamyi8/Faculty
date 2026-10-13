# Services

This folder contains the business logic of the Faculty Module.

## Responsibilities

- Validate faculty creation and update rules.
- Retrieve faculty records through the data layer.
- Create new faculty records.
- Update existing faculty information.
- Deactivate faculty accounts without deleting their history.
- Handle validation and not-found outcomes.

## Example File

`faculty.service.js`

## Important

Services should not depend on Express request or response objects. They receive data from routes, apply business rules, call the data layer, and return results to the routes.
