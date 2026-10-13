const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Load the API contract and display Swagger UI at /docs.
const openapiPath = path.join(__dirname, "server", "openapi.yaml");
const openapiDocument = yaml.load(fs.readFileSync(openapiPath, "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Health endpoint required by the project brief.
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/faculty", require("./server/routes/facultyRoutes"));

// Return Problem Details JSON for unknown routes.
app.use((req, res) => {
  res.status(404).type("application/problem+json").json({
    type: "about:blank",
    title: "Not Found",
    status: 404,
    detail: `Route ${req.method} ${req.originalUrl} was not found.`
  });
});

// Handle malformed JSON and unexpected errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).type("application/problem+json").json({
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      detail: "Request body contains invalid JSON."
    });
  }

  console.error(err);
  return res.status(500).type("application/problem+json").json({
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected server error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`Faculty API running at http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/docs`);
});
