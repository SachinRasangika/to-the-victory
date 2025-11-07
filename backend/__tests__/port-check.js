const net = require('net');
const http = require('http');

function checkPort(port) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Checking port ${port}...`);
    
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${port} is IN USE (process is listening)`);
      } else {
        console.log(`⚠️  Error: ${err.message}`);
      }
      resolve();
    });
    
    server.once('listening', () => {
      server.close();
      console.log(`✅ Port ${port} is AVAILABLE`);
      resolve();
    });
    
    server.listen(port, '127.0.0.1');
  });
}

async function identifyServer() {
  console.log('📍 Attempting to identify the server on localhost:3005...\n');
  
  try {
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3005/', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data.substring(0, 300)
          });
        });
      });
      req.on('error', reject);
      req.setTimeout(2000);
    });
    
    console.log('📊 Response from localhost:3005:');
    console.log(`  Status: ${response.statusCode}`);
    console.log(`  Content-Type: ${response.headers['content-type']}`);
    console.log(`  Server: ${response.headers['server'] || 'Unknown'}`);
    console.log(`  Body preview: ${response.body.substring(0, 150)}...\n`);
    
    // Try to identify if it's Express or something else
    if (response.headers['x-powered-by']?.includes('Express')) {
      console.log('🎯 This appears to be an Express server');
    } else if (response.body.includes('error') && response.body.includes('not_found')) {
      console.log('🎯 This is a custom error response (not Express default)');
    } else {
      console.log('🎯 Unknown server type');
    }
  } catch (err) {
    console.log(`❌ Cannot reach localhost:3005: ${err.message}`);
  }
}

async function run() {
  await identifyServer();
  
  // Check if port is available  
  for (let port of [3005, 3006, 3007, 3008]) {
    await checkPort(port);
  }
  
  process.exit(0);
}

run();
