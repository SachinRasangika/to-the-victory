import { useState, useEffect } from 'react';
import { Clock, Pause, RotateCcw } from 'lucide-react';
import { emit, on, clearListeners } from '../eventBus';
import LiveScorePreview from './LiveScorePreview';
import '../styles/banana-game-step.css';

export default function BananaGameStep({
  onCorrectAnswer,
  onTimeout,
  onGameComplete,
  timeLimit = 16,
}) {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isCorrect, setIsCorrect] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchGameData();

    const unsubscribePause = on('pause', handlePauseGame);
    const unsubscribeRestart = on('restart', handleRestartGame);

    return () => {
      unsubscribePause();
      unsubscribeRestart();
    };
  }, []);

  useEffect(() => {
    if (!loading && timeRemaining > 0 && selectedAnswer === null && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            emit('timeout', { timeRemaining: 0, wrongAttempts });
            if (onGameComplete) {
              onGameComplete({
                correctAnswer: false,
                timedOut: true,
                timeRemaining: 0,
                wrongAttempts,
              });
            } else if (onTimeout) {
              onTimeout();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, timeRemaining, selectedAnswer, onTimeout, onGameComplete, wrongAttempts, isPaused]);

  const handlePauseGame = () => {
    setIsPaused(true);
    emit('gamePaused', { timeRemaining, wrongAttempts });
  };

  const handleResumeGame = () => {
    setIsPaused(false);
    emit('gameResumed', { timeRemaining, wrongAttempts });
  };

  const handleRestartGame = () => {
    setSelectedAnswer(null);
    setTimeRemaining(timeLimit);
    setIsCorrect(null);
    setWrongAttempts(0);
    setIsPaused(false);
    fetchGameData();
    emit('gameRestarted', { timeRemaining: timeLimit, wrongAttempts: 0 });
  };

  const fetchGameData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/game/puzzle');
      const data = await response.json();

      const correctAnswer = data.solution;
      const wrongAnswers = generateWrongAnswers(correctAnswer);
      const allAnswers = shuffleArray([correctAnswer, ...wrongAnswers]);

      setGameData({
        imageUrl: data.image || data.question,
        correctAnswer: correctAnswer,
        answers: allAnswers,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch game data:', error);
      setError('Unable to load game challenge. Please try again.');
      setGameData(null);
      setLoading(false);
    }
  };

  const generateWrongAnswers = (correctAnswer) => {
    const answers = new Set();
    while (answers.size < 2) {
      const wrong = Math.floor(Math.random() * 10);
      if (wrong !== correctAnswer) {
        answers.add(wrong);
      }
    }
    return Array.from(answers);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null || isPaused) return;

    setSelectedAnswer(answer);
    const correct = answer === gameData.correctAnswer;
    setIsCorrect(correct);

    if (!correct) {
      setWrongAttempts((prev) => prev + 1);
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 800);
    } else {
      setTimeout(() => {
        emit('gameComplete', {
          correctAnswer: true,
          timeRemaining,
          wrongAttempts,
        });
        if (onGameComplete) {
          onGameComplete({
            correctAnswer: true,
            timeRemaining,
            wrongAttempts,
          });
        } else if (onCorrectAnswer) {
          onCorrectAnswer();
        }
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="banana-game-loading">
        <div className="loading-spinner"></div>
        <p>Loading challenge...</p>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="banana-game-loading">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#FBBF24', marginBottom: '16px' }}>{error || 'Failed to load challenge'}</p>
          <button
            onClick={fetchGameData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FBBF24',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="banana-game-container">
      <div className="game-main-layout">
        <div className="game-center-section">
          <div className="game-equation-container">
            <img
              src={gameData.imageUrl}
              alt="Math equation challenge"
              className="game-equation-image"
            />
          </div>

          <div className="game-answers-container">
            {gameData.answers.map((answer, index) => (
              <button
                key={index}
                className={`answer-card ${
                  selectedAnswer === answer
                    ? isCorrect
                      ? 'correct'
                      : 'incorrect'
                    : ''
                } ${selectedAnswer !== null && answer !== selectedAnswer ? 'dimmed' : ''}`}
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswer !== null}
              >
                <div className="card-background">
                  <div className="card-overlay-1"></div>
                  <div className="card-overlay-2"></div>
                </div>
                
                <div className="card-border">
                  <div className="corner-decoration top-left">
                    <div className="corner-line"></div>
                    <div className="corner-dot"></div>
                  </div>
                  <div className="corner-decoration top-right">
                    <div className="corner-line"></div>
                    <div className="corner-dot"></div>
                  </div>
                  <div className="corner-decoration bottom-left">
                    <div className="corner-line"></div>
                    <div className="corner-dot"></div>
                  </div>
                  <div className="corner-decoration bottom-right">
                    <div className="corner-line"></div>
                    <div className="corner-dot"></div>
                  </div>
                  <div className="side-dots left">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <div className="side-dots right">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>

                <div className="card-inner-border">
                  <div className="inner-corner top-left"></div>
                  <div className="inner-corner top-right"></div>
                  <div className="inner-corner bottom-left"></div>
                  <div className="inner-corner bottom-right"></div>
                </div>

                <div className="card-top-dots">
                  <div className="top-dot"></div>
                  <div className="top-dot active"></div>
                  <div className="top-dot"></div>
                </div>

                <div className="card-content">
                  <span className="answer-number">{answer}</span>
                </div>

                <div className="card-bottom-line"></div>
                
                <div className="card-glow glow-1"></div>
                <div className="card-glow glow-2"></div>
                <div className="card-glow glow-3"></div>
              </button>
            ))}
          </div>
        </div>

        <aside className="game-sidebar">
          <div className="game-timer">
            <Clock size={24} color="#FBBF24" strokeWidth={2} />
            <span className="timer-text">{timeRemaining} s</span>
          </div>

          <div className="game-controls">
            {!isPaused ? (
              <button
                className="control-btn pause-btn"
                onClick={handlePauseGame}
                title="Pause game"
              >
                <Pause size={20} color="#FBBF24" strokeWidth={2} />
                <span>Pause</span>
              </button>
            ) : (
              <button
                className="control-btn resume-btn"
                onClick={handleResumeGame}
                title="Resume game"
              >
                <Pause size={20} color="#FBBF24" strokeWidth={2} />
                <span>Resume</span>
              </button>
            )}
            <button
              className="control-btn restart-btn"
              onClick={handleRestartGame}
              title="Restart game"
            >
              <RotateCcw size={20} color="#FBBF24" strokeWidth={2} />
              <span>Restart</span>
            </button>
          </div>

          <LiveScorePreview
            timeRemaining={timeRemaining}
            wrongAttempts={wrongAttempts}
            difficulty="Medium"
            timeLimit={16}
          />
        </aside>
      </div>
    </div>
  );
}
