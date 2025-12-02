const { spawn, exec } = require('child_process');
const path = require('path');

const backendPath = path.join(__dirname, '..', 'backend');
const frontendPath = path.join(__dirname, '..', 'frontend');

console.log('Starting backend and frontend servers...\n');

// Kill any existing node processes on ports 3005, 3006, 35068
console.log('🧹 Cleaning up old processes...');
exec('lsof -ti:3005 | xargs kill -9 2>/dev/null || true', () => {
  exec('lsof -ti:35068 | xargs kill -9 2>/dev/null || true', () => {
    startServers();
  });
});

function startServers() {
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: true,
  });

  backend.on('error', (err) => {
    console.error('Backend error:', err);
  });

  setTimeout(() => {
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: frontendPath,
      stdio: 'inherit',
      shell: true,
    });

    frontend.on('error', (err) => {
      console.error('Frontend error:', err);
    });

    const handleExit = (code) => {
      console.log(`\nDev server stopped (code: ${code})`);
      process.exit(code || 0);
    };

    frontend.on('exit', handleExit);
    backend.on('exit', (code) => {
      // Try to restart on exit
      if (code && code !== 0) {
        console.log('Backend crashed, cleaning up and restarting...');
        exec('lsof -ti:3005 | xargs kill -9 2>/dev/null || true', () => {
          setTimeout(startServers, 2000);
        });
      }
    });

    process.on('SIGINT', () => {
      console.log('\nShutting down servers...');
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
      exec('lsof -ti:3005 | xargs kill -9 2>/dev/null || true');
      setTimeout(() => process.exit(0), 1000);
    });
  }, 2000);
}
