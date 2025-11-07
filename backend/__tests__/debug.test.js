const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3005,
      path,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }, (res) => {
      let data = '';
      console.log(`\n📍 ${path}`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Content-Type: ${res.headers['content-type']}`);
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const preview = data.substring(0, 200).replace(/\n/g, '\\n');
        console.log(`  Response: ${preview}...`);
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`  ❌ Error: ${err.message}`);
      resolve();
    });
    
    req.end();
  });
}

async function debug() {
  console.log('🔍 Debugging backend connectivity...\n');
  
  const endpoints = [
    '/health',
    '/api/auth/login',
    '/api/game/leaderboard',
    '/api/users',
    '/notfound'
  ];
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n✅ Debug complete');
  process.exit(0);
}

setTimeout(debug, 1000);
