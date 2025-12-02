import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JourneyScreen from './JourneyScreen';
import BananaGameStep from '../components/BananaGameStep';
import ScoreSummary from '../components/ScoreSummary';
import { on, clearListeners } from '../eventBus';
import { calculateScore } from '../utils/scoreCalculator';
import { saveAttempt } from '../utils/gameApi';
import { completeLevelAndUnlockNext, getLevelConfig } from '../services/levelProgressionService';

const getGameScenes = (levelId) => {
  const levelConfigs = {
    'level-1': {
      levelName: "The Castle Gate – The Guard's Challenge",
      difficulty: 'Easy',
      scenes: [
        {
          sceneNumber: 1,
          sceneTitle: "The Castle Gate – The Guard's Challenge",
          illustrationUrl: "/images/level-1/scene1.png",
          characterName: "Guard",
          dialogue: "Halt! Who dares approach the castle gates? State your purpose, traveler.",
          narrativeText: "A stern guard blocks your path at the castle entrance",
          type: 'dialogue',
        },
        {
          sceneNumber: 2,
          sceneTitle: "The Guard's Test",
          illustrationUrl: "/images/level-1/scene2.png",
          characterName: "Guard",
          dialogue: "Solve my riddle if you wish to pass. If you fail, you must turn back.",
          narrativeText: "The guard steps aside, gesturing to an ancient puzzle",
          type: 'dialogue',
        },
        {
          sceneNumber: 3,
          sceneTitle: "Solve the Guard's Challenge",
          type: 'game',
        },
        {
          sceneNumber: 4,
          sceneTitle: "The Gate Opens",
          illustrationUrl: "/images/level-1/scene4.png",
          characterName: "Guard",
          dialogue: "Impressive! You have proven yourself worthy. The gate opens before you. Continue onward to face greater challenges.",
          narrativeText: "The massive castle gate swings open with a thunderous sound",
          type: 'dialogue',
        },
      ],
    },
    'level-2': {
      levelName: "Meeting the King's Manager",
      difficulty: 'Medium',
      scenes: [
        {
          sceneNumber: 1,
          sceneTitle: "The King's Manager's Chamber",
          illustrationUrl: "/images/level-2/scene1.png",
          characterName: "King's Manager",
          dialogue: "Welcome to the royal court. You have passed the guard's trial. Now, you must prove your wisdom to me.",
          narrativeText: "A noble official observes you with keen interest",
          type: 'dialogue',
        },
        {
          sceneNumber: 2,
          sceneTitle: "The Manager's Judgment",
          illustrationUrl: "/images/level-2/scene2.png",
          characterName: "King's Manager",
          dialogue: "I present to you a puzzle that has stumped many. Show me your cunning mind, and perhaps you will earn an audience with the King himself.",
          narrativeText: "The manager gestures to a complex challenge before you",
          type: 'dialogue',
        },
        {
          sceneNumber: 3,
          sceneTitle: "Prove Your Worth",
          type: 'game',
        },
        {
          sceneNumber: 4,
          sceneTitle: "Royal Favor Earned",
          illustrationUrl: "/images/level-2/scene4.png",
          characterName: "King's Manager",
          dialogue: "Remarkable! Your intellect is as sharp as any blade. The King awaits your presence in his chamber. Go now, show him what you are made of.",
          narrativeText: "The manager bows respectfully, opening the door to the throne room",
          type: 'dialogue',
        },
      ],
    },
    'level-3': {
      levelName: 'Meeting the King Himself',
      difficulty: 'Hard',
      scenes: [
        {
          sceneNumber: 1,
          sceneTitle: "The Throne Room",
          illustrationUrl: "/images/level-3/scene1.png",
          characterName: "The King",
          dialogue: "So, you have passed my tests. Few mortals stand before my throne and live to tell the tale.",
          narrativeText: "The King regards you from his majestic seat, his eyes gleaming with ancient wisdom",
          type: 'dialogue',
        },
        {
          sceneNumber: 2,
          sceneTitle: "The King's Ultimate Challenge",
          illustrationUrl: "/images/level-3/scene2.png",
          characterName: "The King",
          dialogue: "Solve this final challenge. This is a puzzle that has guarded the deepest secrets of my kingdom for centuries. Succeed, and you shall be rewarded beyond measure.",
          narrativeText: "The King leans forward, his voice echoing through the grand hall",
          type: 'dialogue',
        },
        {
          sceneNumber: 3,
          sceneTitle: "The Final Trial",
          type: 'game',
        },
        {
          sceneNumber: 4,
          sceneTitle: "The Crown of Glory",
          illustrationUrl: "/images/level-3/scene4.png",
          characterName: "The King",
          dialogue: "You have done it! You have proven yourself worthy of the highest honor. Rise now, for you shall take your place among the legends of this kingdom.",
          narrativeText: "The King places the crown upon your head as the entire court rises in applause",
          type: 'dialogue',
        },
      ],
    },
  };

  return levelConfigs[levelId]?.scenes || [];
};

export default function Game() {
  const { levelId } = useParams();
  const navigate = useNavigate();

  const gameScenes = getGameScenes(levelId);
  const levelConfig = getLevelConfig().find((l) => l.levelId === levelId);

  const [currentScene, setCurrentScene] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showScoreSummary, setShowScoreSummary] = useState(false);
  const [gameAttempt, setGameAttempt] = useState(null);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [gameStartTime] = useState(Date.now());
  const [gameStatus, setGameStatus] = useState('playing');
  const [unlockingNextLevel, setUnlockingNextLevel] = useState(false);

  useEffect(() => {
    if (!levelConfig) {
      navigate('/levels');
    }
  }, [levelConfig, navigate]);

  const handleGamePaused = useCallback(() => {
    setGameStatus('paused');
    console.log('🎮 Game paused event received');
  }, []);

  const handleGameResumed = useCallback(() => {
    setGameStatus('playing');
    console.log('🎮 Game resumed event received');
  }, []);

  const handleGameTimeout = useCallback(() => {
    setGameStatus('timeout');
    console.log('⏱️ Game timeout event received');
  }, []);

  const handleGameRestarted = useCallback(() => {
    setGameComplete(false);
    setShowScoreSummary(false);
    setGameAttempt(null);
    setScoreBreakdown(null);
    setGameStatus('playing');
    console.log('🔄 Game restarted event received');
  }, []);

  useEffect(() => {
    const unsubscribeGamePaused = on('gamePaused', () => {
      Promise.resolve().then(handleGamePaused);
    });
    const unsubscribeGameResumed = on('gameResumed', () => {
      Promise.resolve().then(handleGameResumed);
    });
    const unsubscribeTimeout = on('timeout', () => {
      Promise.resolve().then(handleGameTimeout);
    });
    const unsubscribeGameRestarted = on('gameRestarted', () => {
      Promise.resolve().then(handleGameRestarted);
    });

    return () => {
      unsubscribeGamePaused();
      unsubscribeGameResumed();
      unsubscribeTimeout();
      unsubscribeGameRestarted();
      clearListeners();
    };
  }, [handleGamePaused, handleGameResumed, handleGameTimeout, handleGameRestarted]);

  const handleNext = () => {
    if (currentScene < gameScenes.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      navigate('/levels');
    }
  };

  const handlePrevious = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      setGameComplete(false);
      setShowScoreSummary(false);
    }
  };

  const handleGameComplete = async (gameResult) => {
    const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);
    const totalSteps = gameScenes.length;
    const completedSteps = currentScene + 1;

    const attempt = {
      levelId: levelId,
      difficulty: levelConfig?.difficulty || 'Medium',
      completed: gameResult.correctAnswer || false,
      completedSteps,
      totalSteps,
      wrongAttempts: gameResult.wrongAttempts || 0,
      timeTaken,
      remainingTime: gameResult.timeRemaining || 0,
      score: 0,
      metadata: {
        sceneIndex: currentScene,
      },
    };

    const { score, breakdown } = calculateScore(attempt);
    attempt.score = score;

    setGameAttempt(attempt);
    setScoreBreakdown(breakdown);
    setGameComplete(true);

    if (gameResult.correctAnswer) {
      try {
        await saveAttempt({
          levelId: attempt.levelId,
          difficulty: attempt.difficulty,
          completed: attempt.completed,
          completedSteps: attempt.completedSteps,
          totalSteps: attempt.totalSteps,
          wrongAttempts: attempt.wrongAttempts,
          timeTaken: attempt.timeTaken,
          remainingTime: attempt.remainingTime,
          metadata: attempt.metadata,
        });
        console.log('Score saved automatically');
      } catch (error) {
        console.error('Failed to auto-save score:', error);
      }
    }

    setShowScoreSummary(true);
  };

  const handleRetry = () => {
    setGameComplete(false);
    setShowScoreSummary(false);
    setGameAttempt(null);
    setScoreBreakdown(null);
  };

  const handleCloseSummary = async () => {
    setShowScoreSummary(false);
    if (gameAttempt?.completed) {
      try {
        setUnlockingNextLevel(true);
        await completeLevelAndUnlockNext(levelId, gameAttempt.score);
        console.log('Level completed and progress updated');
        navigate('/levels');
      } catch (error) {
        console.error('Error unlocking next level:', error);
        navigate('/levels');
      } finally {
        setUnlockingNextLevel(false);
      }
    }
  };

  const scene = gameScenes[currentScene];

  const renderSceneContent = () => {
    if (scene.type === 'game') {
      return (
        <BananaGameStep
          onGameComplete={handleGameComplete}
          timeLimit={16}
        />
      );
    }
    return null;
  };

  return (
    <>
      <JourneyScreen
        sceneNumber={scene.sceneNumber}
        totalScenes={gameScenes.length}
        sceneTitle={scene.sceneTitle}
        illustrationUrl={scene.illustrationUrl}
        characterName={scene.characterName}
        dialogue={scene.dialogue}
        narrativeText={scene.narrativeText}
        onNext={handleNext}
        onPrevious={handlePrevious}
        disablePrevious={currentScene === 0}
        disableNext={scene.type === 'game' && !gameComplete}
        customContent={scene.type === 'game' ? renderSceneContent() : null}
      />

      {showScoreSummary && gameAttempt && scoreBreakdown && (
        <ScoreSummary
          attempt={gameAttempt}
          breakdown={scoreBreakdown}
          onClose={handleCloseSummary}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
