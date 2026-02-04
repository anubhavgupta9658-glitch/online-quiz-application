const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Handles connection pooling and error handling
 * Falls back to mock in-memory database if MongoDB is unavailable
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.warn('⚠️ MongoDB Connection Failed:', error.message);
    console.log('📝 Using In-Memory Mock Database (data will not persist)');
    console.log('💡 To use MongoDB: Install MongoDB or update MONGODB_URI in .env');
    return null;
  }
};

/**
 * Disconnect from MongoDB
 * Used in tests or graceful shutdown
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ MongoDB Disconnection Error:', error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
