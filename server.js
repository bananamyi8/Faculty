
const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const connectDB = require("./server/db");

// ==========================================
// INITIALIZE EXPRESS
// ==========================================
const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// HEALTH CHECK
// ==========================================
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

// ==========================================
// FACULTY ROUTES
// ==========================================
app.use(
  "/api/v1/faculty",
  require("./server/routes/facultyRoutes")
);

// ==========================================
// DEPARTMENT ROUTES
// ==========================================
app.use(
  "/api/v1/departments",
  require("./server/routes/departments")
);

// ==========================================
// NON-FACULTY ROUTES
// ==========================================
app.use(
  "/api/v1/non-faculty",
  require("./server/routes/nonFacultyRoutes")
);

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================
const openapiPath = path.join(
  __dirname,
  "server",
  "openapi.yaml"
);

if (!fs.existsSync(openapiPath)) {
  console.error("ERROR: openapi.yaml not found:", openapiPath);
  process.exit(1);
}

const openapiDocument = yaml.load(
  fs.readFileSync(openapiPath, "utf8")
);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiDocument)
);

// ==========================================
// ROOT ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.send("Faculty Management System API is running!");
});

// ==========================================
// 404 ERROR HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).type("application/problem+json").json({
    type: "about:blank",
    title: "Not Found",
    status: 404,
    detail: `Route ${req.method} ${req.originalUrl} was not found.`
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).type("application/problem+json").json({
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      detail: "Request body contains invalid JSON."
    });
  }

  console.error("Server Error:", err);

  return res.status(500).type("application/problem+json").json({
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected server error occurred."
  });
});

// ==========================================
// CONNECT DATABASE AND START SERVER
// ==========================================
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("==================================");
      console.log("Faculty Management System API");
      console.log("==================================");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/v1/health`);
      console.log(`Faculty: http://localhost:${PORT}/api/v1/faculty`);
      console.log(`Departments: http://localhost:${PORT}/api/v1/departments`);
      console.log(`Non-Faculty: http://localhost:${PORT}/api/v1/non-faculty`);
      console.log(`Swagger: http://localhost:${PORT}/docs`);
      console.log("==================================");
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
