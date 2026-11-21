
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import route files
const facultyRoutes = require('./routes/faculty.routes');
const departmentRoutes = require('./routes/department.routes');
const nonFacultyRoutes = require('./routes/nonfaculty.routes');
const subjectRoutes = require('./routes/subject.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const reportRoutes = require('./routes/report.routes');

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim())
    : true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API version 1 routes
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/non-faculty', nonFacultyRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/reports', reportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Faculty Management System API is running.',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      faculty: '/api/v1/faculty',
      departments: '/api/v1/departments',
      nonFaculty: '/api/v1/non-faculty',
      subjects: '/api/v1/subjects',
      schedules: '/api/v1/schedules',
      reports: '/api/v1/reports'
    }
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from the server .env file.');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`Faculty API running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
