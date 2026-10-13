# ADR-001: Backend Framework

- **Status:** Accepted
- **Decision:** Use Node.js with Express for the Faculty API.
- **Context:** The midterm requires a REST API with mock data, clear route/service/data layers, and Swagger UI documentation.
- **Reasons:** Express provides straightforward HTTP routing and middleware. It is lightweight for a mock-data API and supports integration with Swagger UI.
- **Consequences:** The team must maintain validation and error handling in the service layer. Mock data is temporary and will need a persistence layer for a later phase.
