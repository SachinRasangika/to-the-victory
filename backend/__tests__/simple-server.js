const express = require('express');

const app = express();
const PORT = 3005;

app.use(express.json());

app.get('/health', (req, res) => {
  console.log('✅ Health endpoint called');
  res.json({ status: 'ok', message: 'Simple server is running' });
});

app.post('/test', (req, res) => {
  console.log('✅ Test POST endpoint called');
  res.json({ received: req.body });
});

app.use((req, res) => {
  console.log(`⚠️  Unhandled: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
});
