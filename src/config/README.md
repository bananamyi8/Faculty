# Configuration

This folder centralizes the backend application's configuration.

## Responsibilities

- Read environment variables.
- Configure the server port.
- Configure allowed CORS origins.
- Provide safe default values where appropriate.
- Keep environment-specific settings out of business logic.

## Example File

`config.js`

## Environment Variables

Document the required environment variables in `server/.env.example`.

For example:

- `PORT` — Port used by the backend server.
- `CORS_ORIGINS` — Approved frontend origins.

Do not commit your real `.env` file or expose passwords, tokens, and other secrets.

## Important

The configuration implementation depends on the backend framework selected by the team.
