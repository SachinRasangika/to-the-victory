const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

console.log(`🔧 Initializing Express app...`);
console.log(`📍 PORT: ${PORT}`);

app.use(cors());
app.use(express.json());

// Early logging middleware
app.use((req, res, next) => {
  console.log(`📨 REQUEST: ${req.method} ${req.path} from ${req.ip}`);
  next();
});

connectDB();

console.log('📍 Mounting routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('✅ Auth routes mounted at /api/auth');
app.use('/api/users', require('./routes/users'));
console.log('✅ Users routes mounted at /api/users');
app.use('/api/game', require('./routes/game'));
console.log('✅ Game routes mounted at /api/game');

app.get('/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.json({ message: 'Test endpoint works' });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`❌ NO HANDLER for ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 SERVER ERROR:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`\n✅ SERVER STARTED`);
  console.log(`🚀 Listening on http://localhost:${PORT}`);
  console.log(`📊 Routes ready:\n   - GET /health\n   - GET /api/test\n   - POST /api/auth/signup\n   - POST /api/game/attempt`);
});

server.on('error', (err) => {
  console.error(`💥 SERVER ERROR: ${err.message}`);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
  }
  process.exit(1);
});

server.on('listening', () => {
  console.log(`🔗 Server successfully bound to port ${PORT}`);
});
