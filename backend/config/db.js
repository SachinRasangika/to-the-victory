const mongoose = require('mongoose');

async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri) {
    console.warn('MONGO_URI not set. Skipping database connection.');
    return;
  }
  try {
    await mongoose.connect(uri, {
      // Mongoose 8+ sensible defaults; keep options for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
