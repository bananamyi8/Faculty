const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/database");
const errorHandler = require("./middleware/error-handler");
const { protect, authorize } = require("./middleware/auth.middleware");

const authRoutes = require("./routes/auth.routes");
const integrationRoutes = require("./routes/integration.routes");
const facultyRoutes = require("./routes/faculty.routes");
const departmentRoutes = require("./routes/department.routes");
const nonFacultyRoutes = require("./routes/nonfaculty.routes");
const subjectRoutes = require("./routes/subject.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the Vite frontend (localhost / 127.0.0.1 / LAN address, any port) and CLIENT_URL.
const localOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|\d{1,3}(\.\d{1,3}){3}):\d+$/;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === process.env.CLIENT_URL || localOrigin.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`));
    },
  })
);
app.use(express.json());

app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/integrations", integrationRoutes);

// The current frontend has no login screen, so login checks are OFF by default.
// Set REQUIRE_AUTH=true in .env once the frontend sends a Bearer token.
// admin = everything | staff = read + edit records + reports | faculty = read only
const authOn = process.env.REQUIRE_AUTH === "true";
const writeGuard = (req, res, next) =>
  req.method === "GET" ? next() : authorize("admin", "staff")(req, res, next);
const guard = authOn ? [protect, writeGuard] : [];

app.use("/api/v1/faculty", ...guard, facultyRoutes);
app.use("/api/v1/departments", ...guard, departmentRoutes);
app.use("/api/v1/non-faculty", ...guard, nonFacultyRoutes);
app.use("/api/v1/subjects", ...guard, subjectRoutes);
app.use("/api/v1/schedules", ...guard, scheduleRoutes);
app.use("/api/v1/reports", ...(authOn ? [protect, authorize("admin", "staff")] : []), reportRoutes);

// Swagger docs (openapi.yaml sits in the project root)
const openApiPath = path.join(__dirname, "../../openapi.yaml");
if (fs.existsSync(openApiPath)) {
  try {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(yaml.load(fs.readFileSync(openApiPath, "utf8"))));
  } catch (e) {
    console.warn("Could not load openapi.yaml:", e.message);
  }
}

app.get("/", (req, res) => res.send("Faculty Module API is running!"));

app.use("/api", (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    // Make the database indexes match the current models (drops stale ones from old schemas).
    const models = [
      require("./models/department.model"),
      require("./models/faculty.model"),
      require("./models/nonfaculty.model"),
      require("./models/subject.model"),
      require("./models/schedule.model"),
      require("./models/user.model"),
    ];
    for (const m of models) {
      try { await m.syncIndexes(); }
      catch (e) { console.warn(`Index sync skipped for ${m.modelName}: ${e.message}`); }
    }

    app.listen(PORT, () => {
      console.log(`Faculty API running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(authOn ? "Auth: enabled (admin token required)" : "Auth: OFF (development)");
    });
  } catch (error) {
    console.error("Could not start the API:", error.message);
    process.exit(1);
  }
}

startServer();
