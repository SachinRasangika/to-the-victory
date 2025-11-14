import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import JourneyScreen from './JourneyScreen';
import BananaGameStep from '../components/BananaGameStep';
import ScoreSummary from '../components/ScoreSummary';
import { on, clearListeners } from '../eventBus';
import { calculateScore } from '../utils/scoreCalculator';
import { saveAttempt } from '../utils/gameApi';

const gameScenes = [
  {
    sceneNumber: 1,
    sceneTitle: "The Castle Gate – The Guard's Challenge",
    illustrationUrl: "/images/scene1.png",
    characterName: "Villager",
    dialogue: "Noble guard, I have traveled far to accept the King's Great Challenge. Please, allow me to prove my worth.",
    narrativeText: "The humble villager bows respectfully before the royal gate",
    type: 'dialogue',
  },
  {
    sceneNumber: 2,
    sceneTitle: "The Throne Room – The King's Test",
    illustrationUrl: "/images/scene2.png",
    characterName: "King",
    dialogue: "Welcome, brave traveler. Many have sought the throne, but few have proven themselves worthy. Are you prepared to face my challenge?",
    narrativeText: "The king's voice echoes through the grand hall",
    type: 'dialogue',
  },
  {
    sceneNumber: 3,
    sceneTitle: "The Castle Gate – The Guard's Challenge",
    type: 'game',
  },
  {
    sceneNumber: 4,
    sceneTitle: "The Final Trial – Victory or Defeat",
    illustrationUrl: "/images/scene4.png",
    characterName: "Narrator",
    dialogue: "You have completed the trials and proven your worth. The throne awaits its rightful ruler. Will you claim your destiny?",
    narrativeText: "The path to the throne is now clear",
    type: 'dialogue',
  },
];

const LEVEL_ID = 'level-1';
const DIFFICULTY = 'Medium';

export default function Game() {
  const [currentScene, setCurrentScene] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showScoreSummary, setShowScoreSummary] = useState(false);
  const [gameAttempt, setGameAttempt] = useState(null);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [gameStartTime] = useState(Date.now());
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'paused', 'timeout'
  const navigate = useNavigate();

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
      navigate('/menu');
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
      levelId: LEVEL_ID,
      difficulty: DIFFICULTY,
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

  const handleCloseSummary = () => {
    setShowScoreSummary(false);
    if (gameAttempt?.completed) {
      handleNext();
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
