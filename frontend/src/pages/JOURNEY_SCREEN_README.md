# JourneyScreen Component Documentation

## Overview

The `JourneyScreen` component is a reusable, fully responsive component designed for displaying story scenes, dialogues, and challenges in the Chronicles of Sri Lanka game. It follows the design specifications from Figma and provides a consistent experience across all levels and screen sizes.

## Features

- ✅ **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Reusable** - Same component for all game levels and scenes
- ✅ **Animated Transitions** - Smooth scene changes with visual feedback
- ✅ **Accessible Navigation** - Clear Previous/Next controls with disabled states
- ✅ **Progress Tracking** - Visual progress bars showing scene progression
- ✅ **Themed Design** - Matches the Chronicles of Sri Lanka aesthetic

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sceneNumber` | `number` | `1` | Current scene number (1-based) |
| `totalScenes` | `number` | `4` | Total number of scenes in the level |
| `sceneTitle` | `string` | `''` | Title of the current scene |
| `illustrationUrl` | `string` | `''` | URL for the main scene illustration |
| `characterName` | `string` | `''` | Name of the speaking character (optional) |
| `dialogue` | `string` | `''` | Main dialogue or story text |
| `narrativeText` | `string` | `''` | Italic narrative description (optional) |
| `onNext` | `function` | - | Callback when Next button is clicked |
| `onPrevious` | `function` | - | Callback when Previous button is clicked |
| `disablePrevious` | `boolean` | `false` | Disables the Previous button |
| `disableNext` | `boolean` | `false` | Disables the Next button |
| `customContent` | `React.Node` | `null` | Custom content to render instead of dialogue (for game steps) |
| `hideIllustration` | `boolean` | `false` | Hides the illustration container |
| `hideDialogue` | `boolean` | `false` | Hides the dialogue section |

## Basic Usage

```jsx
import JourneyScreen from './pages/JourneyScreen';

function MyLevel() {
  const handleNext = () => {
    // Handle scene progression
    console.log('Next scene');
  };

  const handlePrevious = () => {
    // Handle going back
    console.log('Previous scene');
  };

  return (
    <JourneyScreen
      sceneNumber={1}
      totalScenes={3}
      sceneTitle="The Castle Gate – The Guard's Challenge"
      illustrationUrl="https://example.com/scene1.jpg"
      characterName="Villager"
      dialogue="Noble guard, I have traveled far to accept the King's Great Challenge."
      narrativeText="The humble villager bows respectfully before the royal gate"
      onNext={handleNext}
      onPrevious={handlePrevious}
      disablePrevious={true}
    />
  );
}
```

## Advanced Usage with State Management

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JourneyScreen from './pages/JourneyScreen';

const levelScenes = [
  {
    sceneNumber: 1,
    sceneTitle: "The Castle Gate",
    illustrationUrl: "/assets/scenes/castle-gate.jpg",
    characterName: "Guard",
    dialogue: "Halt! State your business.",
    narrativeText: "The guard eyes you suspiciously",
  },
  {
    sceneNumber: 2,
    sceneTitle: "The Inner Court",
    illustrationUrl: "/assets/scenes/inner-court.jpg",
    characterName: "Advisor",
    dialogue: "Welcome, traveler. The King awaits.",
    narrativeText: "You enter the grand hall",
  },
  // ... more scenes
];

export default function Level1() {
  const [currentScene, setCurrentScene] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentScene < levelScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      // Level complete, navigate to next level or menu
      navigate('/menu');
    }
  };

  const handlePrevious = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  const scene = levelScenes[currentScene];

  return (
    <JourneyScreen
      {...scene}
      totalScenes={levelScenes.length}
      onNext={handleNext}
      onPrevious={handlePrevious}
      disablePrevious={currentScene === 0}
    />
  );
}
```

## Scene Data Structure

Recommended structure for organizing scene data:

```javascript
const sceneData = {
  sceneNumber: 1,           // Scene index (1-based)
  sceneTitle: "Title",      // Display title
  illustrationUrl: "url",   // Scene image
  characterName: "Name",    // Speaking character (optional)
  dialogue: "Text",         // Main dialogue
  narrativeText: "Text",    // Italic description (optional)
};
```

## Styling Customization

The component uses `journey-screen.css` for styling. Key CSS classes:

- `.journey-screen` - Main container
- `.scene-illustration` - Main scene image
- `.dialogue-box` - Dialogue container
- `.character-tab` - Character name badge
- `.nav-btn` - Navigation buttons
- `.progress-bar` - Progress indicators

## Responsive Breakpoints

The component adapts to three main breakpoints:

- **Desktop**: > 1200px - Full layout with side margins
- **Tablet**: 768px - 1200px - Adjusted spacing and sizing
- **Mobile**: < 768px - Stacked layout with optimized touch targets

## Integration with Routing

```jsx
// In App.jsx
import Game from './pages/Game';

<Route
  path="/game"
  element={
    <ProtectedRoute>
      <Game />
    </ProtectedRoute>
  }
/>

// In MainMenu.jsx
const handleStartGame = () => {
  navigate('/game');
};
```

## Best Practices

1. **Always provide scene numbers** - Start from 1, not 0
2. **Disable buttons appropriately** - Disable Previous on first scene
3. **Handle completion** - Navigate away or show completion screen on last scene
4. **Optimize images** - Use appropriate image sizes for web (max 1920px width)
5. **Provide alt text** - Ensure illustrations have descriptive alt text
6. **Test responsiveness** - Verify on multiple device sizes

## Example: Multiple Levels

```jsx
// levels/castleGate.js
export const castleGateScenes = [
  {
    sceneNumber: 1,
    sceneTitle: "The Castle Gate – The Guard's Challenge",
    illustrationUrl: "/assets/castle-gate-1.jpg",
    characterName: "Villager",
    dialogue: "Noble guard, I have traveled far...",
    narrativeText: "The humble villager bows respectfully",
  },
  // ... more scenes
];

// levels/throneRoom.js
export const throneRoomScenes = [
  {
    sceneNumber: 1,
    sceneTitle: "The Throne Room – The King's Test",
    illustrationUrl: "/assets/throne-room-1.jpg",
    characterName: "King",
    dialogue: "Welcome, brave traveler...",
    narrativeText: "The king's voice echoes",
  },
  // ... more scenes
];

// pages/GameController.jsx
import { useState } from 'react';
import JourneyScreen from './JourneyScreen';
import { castleGateScenes } from '../levels/castleGate';
import { throneRoomScenes } from '../levels/throneRoom';

const allLevels = [castleGateScenes, throneRoomScenes];

export default function GameController() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = allLevels[currentLevel];
  const scene = scenes[currentScene];

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else if (currentLevel < allLevels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setCurrentScene(0);
    } else {
      // Game complete
      navigate('/victory');
    }
  };

  // ... rest of logic
}
```

## Accessibility

The component includes:

- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly labels
- Focus management on buttons

## Performance Considerations

- Images are lazy-loaded by default
- CSS animations use GPU acceleration
- Minimal re-renders with proper prop handling
- Optimized backdrop filters

## Troubleshooting

**Scene images not loading?**
- Verify image URLs are accessible
- Check network tab for 404 errors
- Ensure images are properly optimized

**Navigation not working?**
- Verify `onNext` and `onPrevious` callbacks are provided
- Check button disabled states
- Ensure scene state is updating correctly

**Styling issues?**
- Import `journey-screen.css` in component
- Check for CSS conflicts with global styles
- Verify responsive breakpoints match device

## Scoring System

### Overview

The game includes a comprehensive, configurable point system that rewards players based on difficulty level, completion speed, and accuracy. The system is fully persistent with backend validation.

### Configuration

Scoring parameters are defined in `frontend/src/config/scoreConfig.js` and `backend/utils/scoreCalculator.js`:

```javascript
{
  "Easy": {
    "basePoints": 100,
    "timeMultiplier": 5,           // Points per remaining second
    "firstTryBonus": 50,            // Bonus for no wrong answers
    "wrongAnswerPenalty": 10,       // Points lost per wrong attempt
    "timeoutPenalty": 50,           // Points lost on timeout
    "partialBaseFraction": 0.5      // Fraction of base for incomplete
  },
  "Medium": {
    "basePoints": 200,
    "timeMultiplier": 5,
    "firstTryBonus": 50,
    "wrongAnswerPenalty": 15,
    "timeoutPenalty": 75,
    "partialBaseFraction": 0.5
  },
  "Hard": {
    "basePoints": 300,
    "timeMultiplier": 5,
    "firstTryBonus": 50,
    "wrongAnswerPenalty": 20,
    "timeoutPenalty": 100,
    "partialBaseFraction": 0.5
  }
}
```

### Scoring Formula

#### For Completed Levels
```
timeBonus = remainingSeconds × timeMultiplier
accuracyBonus = wrongAttempts === 0 ? firstTryBonus : 0
wrongPenalty = wrongAttempts × wrongAnswerPenalty

finalScore = basePoints + timeBonus + accuracyBonus - wrongPenalty
```

#### For Failed/Timeout Attempts
```
progressRatio = completedSteps / totalSteps
partialPoints = basePoints × partialBaseFraction × progressRatio
wrongPenalty = wrongAttempts × wrongAnswerPenalty
timeoutPenalty = completedSteps > 0 ? timeoutPenalty : 0

finalScore = partialPoints - wrongPenalty - timeoutPenalty
finalScore = max(0, finalScore)  // Never negative
```

### Example Calculations

**Example 1: Perfect Medium Level (first try, 7 seconds remaining)**
```
basePoints = 200
timeBonus = 7 × 5 = 35
accuracyBonus = 50
wrongPenalty = 0
finalScore = 200 + 35 + 50 = 285 points
```

**Example 2: Failed Hard Level (2/4 steps, 1 wrong attempt)**
```
basePoints = 300
progressRatio = 2/4 = 0.5
partialPoints = 300 × 0.5 × 0.5 = 75
wrongPenalty = 1 × 20 = 20
timeoutPenalty = 0
finalScore = 75 - 20 = 55 points
```

### Scoring Components

#### LiveScorePreview
Shows player their potential score in real-time during gameplay:

```jsx
import LiveScorePreview from '../components/LiveScorePreview';

<LiveScorePreview
  timeRemaining={timeRemaining}
  wrongAttempts={wrongAttempts}
  difficulty="Medium"
  timeLimit={16}
/>
```

#### ScoreSummary Modal
Displays detailed score breakdown after level completion:

```jsx
import ScoreSummary from '../components/ScoreSummary';

<ScoreSummary
  attempt={attempt}
  breakdown={breakdown}
  onClose={handleClose}
  onRetry={handleRetry}
/>
```

### API Endpoints

#### Save Attempt
```
POST /api/game/attempt
Authorization: Bearer {token}

Request Body:
{
  "levelId": "string",
  "difficulty": "Easy|Medium|Hard",
  "completed": boolean,
  "completedSteps": number,
  "totalSteps": number,
  "wrongAttempts": number,
  "timeTaken": number,
  "remainingTime": number,
  "metadata": {}
}

Response:
{
  "attempt": { /* saved attempt object */ },
  "score": number,
  "breakdown": {
    "basePoints": number,
    "timeBonus": number,
    "accuracyBonus": number,
    "wrongPenalty": number,
    "timeoutPenalty": number
  },
  "userTotalScore": number
}
```

#### Get User Scores
```
GET /api/game/scores
Authorization: Bearer {token}

Response:
{
  "userId": "string",
  "totalScore": number,
  "levelBestScores": [
    {
      "levelId": "string",
      "difficulty": "Easy|Medium|Hard",
      "bestScore": number,
      "attemptId": "string",
      "achievedAt": "ISO8601 date"
    }
  ],
  "attemptCount": number,
  "createdAt": "ISO8601 date",
  "updatedAt": "ISO8601 date"
}
```

#### Get Leaderboard
```
GET /api/game/leaderboard?difficulty=Medium&limit=50

Response:
{
  "leaderboard": [
    {
      "userId": "string",
      "user": {
        "name": "string",
        "email": "string"
      },
      "totalScore": number,
      "attemptCount": number,
      "rank": number
    }
  ],
  "difficulty": "string"
}
```

### Frontend Integration Example

```jsx
import { useState } from 'react';
import { calculateScore } from '../utils/scoreCalculator';
import { saveAttempt } from '../utils/gameApi';
import ScoreSummary from '../components/ScoreSummary';

export default function GameLevel() {
  const [showSummary, setShowSummary] = useState(false);
  const [gameAttempt, setGameAttempt] = useState(null);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);

  const handleGameComplete = async (gameResult) => {
    const attempt = {
      levelId: 'level-1',
      difficulty: 'Medium',
      completed: gameResult.correctAnswer,
      completedSteps: 3,
      totalSteps: 4,
      wrongAttempts: gameResult.wrongAttempts,
      timeTaken: 9,
      remainingTime: gameResult.timeRemaining,
    };

    const { score, breakdown } = calculateScore(attempt);
    attempt.score = score;

    setGameAttempt(attempt);
    setScoreBreakdown(breakdown);
    setShowSummary(true);
  };

  return (
    <>
      {/* Game UI */}
      {showSummary && (
        <ScoreSummary
          attempt={gameAttempt}
          breakdown={scoreBreakdown}
          onClose={() => setShowSummary(false)}
          onRetry={() => setShowSummary(false)}
        />
      )}
    </>
  );
}
```

### Data Models

#### Attempt Schema (MongoDB)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  levelId: String,            // e.g., "level-1"
  difficulty: String,         // "Easy", "Medium", "Hard"
  score: Number,              // Final calculated score (0+)
  completed: Boolean,         // Whether level was completed
  completedSteps: Number,     // Steps completed (0 to totalSteps)
  totalSteps: Number,         // Total steps in level
  wrongAttempts: Number,      // Count of wrong answers
  timeTaken: Number,          // Seconds spent on level
  remainingTime: Number,      // Seconds remaining (if completed)
  metadata: Mixed,            // Custom data
  createdAt: Date
}
```

#### UserScores Schema (MongoDB)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User (unique)
  totalScore: Number,         // Sum of all attempt scores
  levelBestScores: [
    {
      levelId: String,
      difficulty: String,
      bestScore: Number,
      attemptId: ObjectId,    // Reference to best Attempt
      achievedAt: Date
    }
  ],
  attemptCount: Number,       // Total attempts made
  createdAt: Date,
  updatedAt: Date
}
```

### Tuning & Configuration

To adjust scoring difficulty:

1. **Easy rewards**: Increase `basePoints` and `timeMultiplier`
2. **Hard punishment**: Increase `wrongAnswerPenalty` and `timeoutPenalty`
3. **Speed incentive**: Increase `timeMultiplier`
4. **Accuracy incentive**: Increase `firstTryBonus`
5. **Partial credit**: Adjust `partialBaseFraction` (0.5 = 50%)

Changes to config files automatically apply on server restart—no code changes needed.

### Validation & Security

- **Client-side**: Score calculated for instant feedback in UI
- **Server-side**: Score recalculated from submitted data for validation
- **Mismatch handling**: Server rejects attempts where calculated score ≠ submitted score
- **Never negative**: Final score is always `max(0, calculated)`

## Game Step Integration

The JourneyScreen now supports custom content for interactive game steps:

```jsx
import { useState } from 'react';
import JourneyScreen from './pages/JourneyScreen';
import BananaGameStep from './components/BananaGameStep';

export default function GameLevel() {
  const [currentScene, setCurrentScene] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const scenes = [
    { sceneNumber: 1, type: 'dialogue', sceneTitle: "Introduction", ... },
    { sceneNumber: 2, type: 'dialogue', sceneTitle: "Challenge", ... },
    { sceneNumber: 3, type: 'game', sceneTitle: "The Guard's Challenge" },
    { sceneNumber: 4, type: 'dialogue', sceneTitle: "Victory", ... },
  ];

  const scene = scenes[currentScene];

  const handleGameCorrect = () => {
    setGameComplete(true);
  };

  const renderGameContent = () => {
    if (scene.type === 'game') {
      return (
        <BananaGameStep
          onCorrectAnswer={handleGameCorrect}
          onTimeout={() => navigate('/menu')}
        />
      );
    }
    return null;
  };

  return (
    <JourneyScreen
      {...scene}
      totalScenes={scenes.length}
      onNext={handleNext}
      onPrevious={handlePrevious}
      disableNext={scene.type === 'game' && !gameComplete}
      customContent={renderGameContent()}
    />
  );
}
```

## Future Enhancements

Potential improvements for future versions:

- [x] Custom content support for game steps
- [x] Four-step level progression
- [ ] Animation transitions between scenes
- [ ] Audio support for dialogue
- [ ] Character portraits with animations
- [ ] Choice-based branching narratives
- [ ] Save/load scene progress
- [ ] Accessibility improvements (ARIA labels)
- [ ] Gamepad support

## Support

For issues or questions about the JourneyScreen component:
- Check the component source code: `frontend/src/pages/JourneyScreen.jsx`
- Review the example implementation: `frontend/src/pages/Game.jsx`
- Refer to the design specs in Figma

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: Chronicles of Sri Lanka Dev Team
