require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { initializeMockDB } = require('./config/mockData');

// Import routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Global variable to track database mode
global.USE_MOCK_DB = true;

// ============================================
// DATABASE CONNECTION
// ============================================

const initializeServer = async () => {
  try {
    const dbConnection = await connectDB();
    if (dbConnection) {
      global.USE_MOCK_DB = false;
    } else {
      // Initialize mock database
      initializeMockDB();
    }
  } catch (error) {
    console.warn('Using mock in-memory database');
    global.USE_MOCK_DB = true;
    // Initialize mock database
    initializeMockDB();
  }

  // ============================================
  // MIDDLEWARE SETUP
  // ============================================

  // CORS Configuration
  app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // ============================================
  // API ROUTES
  // ============================================

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Online Quiz Application Backend is running',
      database: global.USE_MOCK_DB ? 'In-Memory (Mock)' : 'MongoDB',
      timestamp: new Date().toISOString()
    });
  });

  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Quiz routes
  app.use('/api/quizzes', quizRoutes);

  // Question routes
  app.use('/api/questions', questionRoutes);

  // Result routes
  app.use('/api/results', resultRoutes);

  // ============================================
  // ERROR HANDLING
  // ============================================

  // 404 Not Found middleware
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
      path: req.path
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  // ============================================
  // SERVER STARTUP
  // ============================================

  app.listen(PORT, () => {
    console.log('═'.repeat(50));
    console.log('🚀 ONLINE QUIZ APPLICATION');
    console.log('═'.repeat(50));
    console.log(`✅ Server is running on port: ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`📊 Database: ${global.USE_MOCK_DB ? '📝 In-Memory Mock' : '🗄️ MongoDB'}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('═'.repeat(50));
  });
};

// Initialize and start server
initializeServer().catch(error => {
  console.error('❌ Failed to initialize server:', error.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error.message);
  process.exit(1);
});

module.exports = app;
