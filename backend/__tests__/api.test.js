const http = require('http');

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data, error: 'Not JSON' });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health check
    console.log('Test 1: Health Check');
    const health = await makeRequest('/health');
    console.log(`  Status: ${health.status}`);
    console.log(`  Result: ${health.status === 200 ? '✅ PASS' : '❌ FAIL'}\n`);

    // Test 2: Signup
    console.log('Test 2: User Signup');
    const email = `test${Date.now()}@example.com`;
    const signupRes = await makeRequest('/api/auth/signup', 'POST', {
      name: 'Test User',
      email,
      password: 'testpass123'
    });
    console.log(`  Status: ${signupRes.status}`);
    console.log(`  Result: ${signupRes.status === 201 ? '✅ PASS' : '❌ FAIL'}`);
    if (signupRes.status !== 201) {
      console.log(`  Error: ${JSON.stringify(signupRes.data)}`);
    }
    const token = signupRes.data?.token;
    console.log(`  Token received: ${token ? '✅ Yes' : '❌ No'}\n`);

    if (token) {
      // Test 3: Save attempt
      console.log('Test 3: Save Game Attempt');
      const attemptRes = await makeRequest('/api/game/attempt', 'POST', {
        levelId: 'level-1',
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        timeTaken: 120,
        remainingTime: 0,
        metadata: { test: true }
      }, token);
      console.log(`  Status: ${attemptRes.status}`);
      console.log(`  Result: ${attemptRes.status === 201 ? '✅ PASS' : '❌ FAIL'}`);
      if (attemptRes.status !== 201) {
        console.log(`  Error: ${JSON.stringify(attemptRes.data)}`);
      } else {
        console.log(`  Score saved: ${attemptRes.data?.score}`);
      }
      console.log();

      // Test 4: Get user scores
      console.log('Test 4: Fetch User Scores');
      const scoresRes = await makeRequest('/api/game/scores', 'GET', null, token);
      console.log(`  Status: ${scoresRes.status}`);
      console.log(`  Result: ${scoresRes.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
      if (scoresRes.status === 200) {
        console.log(`  Total Score: ${scoresRes.data?.totalScore}`);
      }
      console.log();
    }

    // Test 5: Leaderboard
    console.log('Test 5: Fetch Leaderboard');
    const leaderboardRes = await makeRequest('/api/game/leaderboard?difficulty=Medium&limit=10');
    console.log(`  Status: ${leaderboardRes.status}`);
    console.log(`  Result: ${leaderboardRes.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
    if (leaderboardRes.status === 200) {
      console.log(`  Leaderboard entries: ${leaderboardRes.data?.leaderboard?.length || 0}`);
    } else {
      console.log(`  Response: ${JSON.stringify(leaderboardRes.data)}`);
    }

  } catch (err) {
    console.error('❌ Test Error:', err.message);
  }

  console.log('\n✅ Test suite complete!');
  process.exit(0);
}

setTimeout(runTests, 2000);
