const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const connectDB = require("./config/database");
const errorHandler = require("./middleware/error-handler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/faculty", require("./routes/faculty.routes"));
app.use("/api/v1/departments", require("./routes/department.routes"));

const openApiPath = path.join(__dirname, "../openapi.yaml");
if (fs.existsSync(openApiPath)) {
  const openApiDocument = yaml.load(fs.readFileSync(openApiPath, "utf8"));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
} else {
  console.warn("openapi.yaml was not found. Swagger documentation is disabled.");
}

app.get("/", (req, res) => {
  res.send("Faculty Module API is running!");
});

app.use(errorHandler);

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
