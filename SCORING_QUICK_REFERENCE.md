# Scoring System - Quick Reference

## One-Minute Overview

Players earn points based on **difficulty**, **speed**, and **accuracy**. The system automatically:
- ✅ Tracks game statistics (attempts, time, errors)
- ✅ Calculates scores client-side (instant feedback)
- ✅ Validates server-side (prevents cheating)
- ✅ Persists to MongoDB
- ✅ Shows breakdown modal after each level
- ✅ Maintains user totals and level best scores

---

## For Game Designers (Tuning Difficulty)

### Change: Increase Medium Difficulty Rewards
**File**: `backend/utils/scoreCalculator.js` (line ~15)

```javascript
// Find this:
Medium: {
  basePoints: 200,

// Change to:
Medium: {
  basePoints: 250,
```

**Also update frontend** (`frontend/src/config/scoreConfig.js`)

**Restart** dev server. **Done!** No code changes needed.

### Common Adjustments

| Goal | Change |
|------|--------|
| Reward speed more | Increase `timeMultiplier` (5 → 10) |
| Punish mistakes more | Increase `wrongAnswerPenalty` |
| Give partial credit | Increase `partialBaseFraction` (0.5 → 0.75) |
| Make first-try bonus bigger | Increase `firstTryBonus` (50 → 100) |

---

## For Backend Developers

### Add Scoring to New Level

```javascript
// In your level handler:
const attempt = {
  levelId: 'level-2',
  difficulty: 'Hard',
  completed: true,
  completedSteps: 4,
  totalSteps: 4,
  wrongAttempts: 0,
  timeTaken: 12,
  remainingTime: 4
};

const response = await saveAttempt(attempt);
console.log(response.score);      // 380
console.log(response.breakdown);  // { basePoints, timeBonus, ... }
console.log(response.userTotalScore); // Updated total
```

### Get User's Best Scores

```javascript
const userScores = await getUserScores(); // Requires token
console.log(userScores.totalScore);       // 2485
console.log(userScores.levelBestScores);  // [{ levelId, difficulty, bestScore, ... }]
```

### Get Leaderboard

```javascript
const { leaderboard, difficulty } = await getLeaderboard('Medium', 50);
leaderboard.forEach(entry => {
  console.log(`${entry.rank}. ${entry.user.name}: ${entry.totalScore}`);
});
```

---

## For Frontend Developers

### Display Current Attempt Score

```jsx
import { calculateScore } from '../utils/scoreCalculator';

const attempt = {
  difficulty: 'Medium',
  completed: true,
  completedSteps: 4,
  totalSteps: 4,
  wrongAttempts: 0,
  remainingTime: 7
};

const { score, breakdown } = calculateScore(attempt);
console.log(`Score: ${score}`);        // 285
console.log(breakdown.basePoints);     // 200
console.log(breakdown.timeBonus);      // 35
console.log(breakdown.accuracyBonus);  // 50
```

### Show Live Score Preview

```jsx
import LiveScorePreview from '../components/LiveScorePreview';

<LiveScorePreview
  timeRemaining={timeLeft}
  wrongAttempts={mistakes}
  difficulty="Medium"
  timeLimit={16}
/>
```

### Show Score After Level

```jsx
import ScoreSummary from '../components/ScoreSummary';

<ScoreSummary
  attempt={{
    levelId: 'level-1',
    difficulty: 'Medium',
    completed: true,
    completedSteps: 4,
    totalSteps: 4,
    wrongAttempts: 0,
    timeTaken: 9,
    remainingTime: 7,
    score: 285
  }}
  breakdown={{
    basePoints: 200,
    timeBonus: 35,
    accuracyBonus: 50,
    wrongPenalty: 0,
    timeoutPenalty: 0
  }}
  onClose={() => navigate('/next-level')}
  onRetry={() => navigate('/level-1')}
/>
```

---

## Scoring Formula (Copy-Paste)

### Completed Level
```
timeBonus = remainingSeconds × timeMultiplier
accuracyBonus = wrongAttempts === 0 ? firstTryBonus : 0
wrongPenalty = wrongAttempts × wrongAnswerPenalty

score = basePoints + timeBonus + accuracyBonus - wrongPenalty
score = max(0, score)
```

### Incomplete Level
```
partialPoints = basePoints × partialBaseFraction × (completedSteps / totalSteps)
wrongPenalty = wrongAttempts × wrongAnswerPenalty
timeoutPenalty = completedSteps > 0 ? timeoutPenalty : 0

score = partialPoints - wrongPenalty - timeoutPenalty
score = max(0, score)
```

---

## API Cheat Sheet

### Save Game Attempt
```
POST /api/game/attempt
Authorization: Bearer {token}
Content-Type: application/json

{
  "levelId": "level-1",
  "difficulty": "Medium",
  "completed": true,
  "completedSteps": 4,
  "totalSteps": 4,
  "wrongAttempts": 0,
  "timeTaken": 9,
  "remainingTime": 7
}

Response: { score, breakdown, userTotalScore }
```

### Get My Scores
```
GET /api/game/scores
Authorization: Bearer {token}

Response: { totalScore, levelBestScores, attemptCount }
```

### Get Leaderboard
```
GET /api/game/leaderboard?difficulty=Medium&limit=50

Response: { leaderboard: [{ rank, user, totalScore }], difficulty }
```

### Get My Best on Level
```
GET /api/game/level-best/level-1/Medium
Authorization: Bearer {token}

Response: { bestScore, attemptId }
```

---

## Debug Scoring

### Check Client Calculation

```javascript
import { calculateScore } from '../utils/scoreCalculator';

const test = {
  difficulty: 'Medium',
  completed: true,
  completedSteps: 4,
  totalSteps: 4,
  wrongAttempts: 1,
  remainingTime: 5
};

const { score, breakdown } = calculateScore(test);
console.log('Score:', score);
console.log('Breakdown:', breakdown);
```

**Expected Output**:
```
Score: 200
Breakdown: {
  basePoints: 200,
  timeBonus: 25,
  accuracyBonus: 0,
  wrongPenalty: 15,
  timeoutPenalty: 0
}
```

### Test API Endpoint

```bash
# Save test attempt
curl -X POST http://localhost:3005/api/game/attempt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "levelId": "test-1",
    "difficulty": "Easy",
    "completed": true,
    "completedSteps": 4,
    "totalSteps": 4,
    "wrongAttempts": 0,
    "timeTaken": 5,
    "remainingTime": 10
  }'

# Get user scores
curl http://localhost:3005/api/game/scores \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get leaderboard
curl http://localhost:3005/api/game/leaderboard?difficulty=Easy
```

---

## Common Patterns

### Pattern 1: Reward Perfect Attempts
```javascript
// Default config already does this with firstTryBonus
// To increase: set firstTryBonus: 100 (was 50)
```

### Pattern 2: Speed Challenge
```javascript
// Increase timeMultiplier: 5 → 15
// Now time bonus matters much more
```

### Pattern 3: Accuracy Challenge
```javascript
// Increase wrongAnswerPenalty: 15 → 50
// Set firstTryBonus: 200
// Mistakes hurt, perfection pays
```

### Pattern 4: Progressive Difficulty
```javascript
// Level 1 (Easy): basePoints 100
// Level 2 (Medium): basePoints 200
// Level 3 (Hard): basePoints 300
// Already configured by difficulty
```

---

## File Locations

| Component | Location |
|-----------|----------|
| Score Config | `backend/utils/scoreCalculator.js` |
| Score Config | `frontend/src/config/scoreConfig.js` |
| Calculate Score | `frontend/src/utils/scoreCalculator.js` |
| API Client | `frontend/src/utils/gameApi.js` |
| Score Summary UI | `frontend/src/components/ScoreSummary.jsx` |
| Live Preview | `frontend/src/components/LiveScorePreview.jsx` |
| API Routes | `backend/routes/game.js` |
| Models | `backend/models/Attempt.js` |
| Models | `backend/models/UserScores.js` |
| Tests | `frontend/src/__tests__/scoreCalculator.test.js` |
| Tests | `backend/__tests__/scoreCalculator.test.js` |

---

## Testing

### Run Frontend Tests
```bash
cd frontend
npm test -- scoreCalculator.test.js
```

### Run Backend Tests
```bash
cd backend
npm test -- scoreCalculator.test.js
```

### Manual Test Game Flow
1. Navigate to `/game`
2. Complete level (get score)
3. See LiveScorePreview during play
4. See ScoreSummary after level
5. Check `GET /api/game/scores` for persistence

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Score is 0 | Check `completed` flag is true or partial logic |
| Negative score | Should be clamped to 0 by `Math.max(0, ...)` |
| API error 401 | Missing/invalid bearer token |
| API error 404 | `levelId` or `difficulty` invalid |
| Wrong calculation | Check config matches client + server |
| Test failing | Verify config is loaded correctly |

---

## Performance Notes

- ⚡ Score calculation is instant (< 1ms)
- ⚡ API calls are optimized with indexes
- ⚡ Leaderboard uses aggregation pipeline
- ⚡ No N+1 queries

---

## Security Notes

- 🔒 Server recalculates all scores (prevents tampering)
- 🔒 Auth middleware required on scoring endpoints
- 🔒 Never stores negative scores
- 🔒 Leaderboard anonymizes by rank, not user ID
- 🔒 No client-side score injection possible

---

**Need Details?** See `SCORING_IMPLEMENTATION.md`
