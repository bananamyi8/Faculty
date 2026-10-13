# Middleware

This folder contains shared request-processing functions used by the backend.

## Responsibilities

- Handle errors consistently.
- Log incoming requests and errors.
- Return errors using the Problem Details format specified in `API-CONTRACT.md`.
- Avoid exposing stack traces or sensitive information to API clients.
- Support other shared request-processing needs.

## Example File

`error-handler.js`

## Important

Register middleware in the correct order in the server entry point.

If the project uses a framework with built-in exception handling, follow the framework's conventions while preserving the API's required error format.
