
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const libraryRoutes = require("./routes/library.routes");

const connectDB = require("./config/database");
const errorHandler = require("./middleware/error-handler");

// Initialize Express FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API Routes
app.use("/api/v1/library", libraryRoutes);
app.use("/api/v1/faculty", require("./routes/faculty.routes"));
app.use("/api/v1/departments", require("./routes/department.routes"));

// Swagger documentation
const openApiPath = path.join(__dirname, "../openapi.yaml");

if (fs.existsSync(openApiPath)) {
  const openApiDocument = yaml.load(
    fs.readFileSync(openApiPath, "utf8")
  );

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
} else {
  console.warn(
    "openapi.yaml was not found. Swagger documentation is disabled."
  );
}

// Root route
app.get("/", (req, res) => {
  res.send("Faculty Module API is running!");
});

// Error handler (keep this after your routes)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Faculty API running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`Swagger UI: http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error("Could not start the API:", error.message);
    process.exit(1);
  }
}

startServer();
