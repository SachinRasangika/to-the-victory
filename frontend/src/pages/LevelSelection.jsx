import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Play, Trophy } from 'lucide-react';
import { getUserProgress, getLevelConfig } from '../services/levelProgressionService';
import '../styles/level-selection.css';

export default function LevelSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const progress = await getUserProgress();
        setUserProgress(progress);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [location]);

  const handlePlayLevel = (levelId) => {
    navigate(`/game/${levelId}`);
  };

  const handleBack = () => {
    navigate('/menu');
  };

  const levelConfig = getLevelConfig();

  if (loading) {
    return (
      <div className="level-selection-page">
        <div className="level-selection-loading">Loading levels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="level-selection-page">
        <div className="level-selection-error">Error: {error}</div>
        <button onClick={handleBack} className="level-selection-back-btn">
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="level-selection-page">
      <div className="level-selection-bg-overlay"></div>

      <div className="level-selection-container">
        <div className="level-selection-header">
          <h1 className="level-selection-title">Choose Your Path</h1>
          <p className="level-selection-subtitle">Master each trial to prove your worth</p>
        </div>

        <div className="level-selection-grid">
          {userProgress?.levels.map((level, index) => {
            const isLocked = !level.unlocked;

            return (
              <div key={level.levelId} className={`level-card ${isLocked ? 'level-card-locked' : ''}`}>
                <div className="level-card-header">
                  <span className="level-card-number">Level {index + 1}</span>
                  {level.completed && <Trophy size={24} className="level-card-completed-icon" />}
                </div>

                <div className="level-card-content">
                  <h2 className="level-card-title">{level.levelName}</h2>
                  <p className="level-card-difficulty">{level.difficulty}</p>

                  {level.completed && (
                    <div className="level-card-best-score">
                      <p className="level-card-score-label">Best Score: {level.bestScore}</p>
                      <p className="level-card-attempts">Attempts: {level.attempts}</p>
                    </div>
                  )}

                  {!level.completed && level.unlocked && (
                    <p className="level-card-status">Ready to play</p>
                  )}

                  {isLocked && (
                    <div className="level-card-locked-content">
                      <Lock size={32} className="level-card-lock-icon" />
                      <p className="level-card-locked-text">Complete Level {index} to unlock</p>
                    </div>
                  )}
                </div>

                {level.unlocked && (
                  <button
                    className="level-card-play-btn"
                    onClick={() => handlePlayLevel(level.levelId)}
                  >
                    <Play size={18} />
                    {level.completed ? 'Play Again' : 'Play'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={handleBack} className="level-selection-back-btn">
          Back to Menu
        </button>
      </div>
    </div>
  );
}
