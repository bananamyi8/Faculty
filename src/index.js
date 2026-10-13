const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

const facultyRoutes = require("./routes/faculty.routes");
app.use("/api/v1/faculty", facultyRoutes);

const departmentRoutes = require("./routes/department.routes");
app.use("/api/v1/departments", departmentRoutes);

const openApiPath = path.join(__dirname, "../openapi.yaml");

if (!fs.existsSync(openApiPath)) {
    console.error("ERROR: openapi.yaml was not found at:", openApiPath);
    process.exit(1);
}

const openApiDocument = yaml.load(
    fs.readFileSync(openApiPath, "utf8")
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/", (req, res) => {
    res.send("Faculty Module API is running!");
});

app.listen(PORT, () => {
    console.log(`Faculty API running at http://localhost:${PORT}`);
    console.log(`Swagger UI at http://localhost:${PORT}/docs`);
});