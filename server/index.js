const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const driversRoutes = require('./routes/drivers');

const app = express();
const PORT = 5000;

// MongoDB connection (hardcoded)
const MONGODB_URI = 'mongodb+srv://dc-developer:0W9zG7qWoJltTR94@cluster0.7ip7q.mongodb.net/happygoo';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  console.log('⚠️  Check MongoDB Atlas connection string');
});

// Routes
app.use('/api/drivers', driversRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server (only if not in serverless environment)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  });
}

// Export for Vercel serverless functions
module.exports = app;

