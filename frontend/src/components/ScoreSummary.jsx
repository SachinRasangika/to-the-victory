import { useState, useEffect } from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { getUserScores } from '../utils/gameApi';
import '../styles/score-summary.css';

export default function ScoreSummary({
  attempt,
  breakdown,
  onClose,
  onRetry,
}) {
  const [loading, setLoading] = useState(true);
  const [userTotalScore, setUserTotalScore] = useState(0);
  const [isBestScore, setIsBestScore] = useState(false);

  useEffect(() => {
    fetchUserScoresInfo();
  }, []);

  const fetchUserScoresInfo = async () => {
    try {
      const userScores = await getUserScores();
      setUserTotalScore(userScores.totalScore);

      const levelBest = userScores.levelBestScores.find(
        (lb) =>
          lb.levelId === attempt.levelId &&
          lb.difficulty === attempt.difficulty
      );

      if (levelBest && levelBest.bestScore === attempt.score) {
        setIsBestScore(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user scores:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="score-summary-overlay">
        <div className="score-summary-modal">
          <div className="loading-spinner"></div>
          <p>Recording your score...</p>
        </div>
      </div>
    );
  }

  const points = attempt.score;
  const isFirstTry = attempt.wrongAttempts === 0;

  return (
    <div className="score-summary-overlay">
      <div className="score-summary-modal">
        <div className="summary-header">
          <div className="summary-title-container">
            {attempt.completed ? (
              <>
                <Award size={32} className="summary-icon success" />
                <h2 className="summary-title">
                  {isFirstTry ? '🎉 Perfect!' : 'Level Complete!'}
                </h2>
              </>
            ) : (
              <>
                <TrendingUp size={32} className="summary-icon partial" />
                <h2 className="summary-title">Partial Progress</h2>
              </>
            )}
          </div>
        </div>

        <div className="score-display">
          <div className="main-score">
            <span className="score-label">Total Points Earned</span>
            <span className="score-value">+{points}</span>
          </div>
        </div>

        {isBestScore && (
          <div className="best-score-badge">✨ New Personal Best! ✨</div>
        )}

        <div className="score-breakdown">
          <h3 className="breakdown-title">Score Breakdown</h3>
          <div className="breakdown-items">
            {breakdown.basePoints > 0 && (
              <div className="breakdown-item">
                <span className="item-label">Base Points</span>
                <span className="item-value positive">+{breakdown.basePoints}</span>
              </div>
            )}

            {breakdown.timeBonus > 0 && (
              <div className="breakdown-item">
                <span className="item-label">Speed Bonus</span>
                <span className="item-value positive">+{breakdown.timeBonus}</span>
              </div>
            )}

            {breakdown.accuracyBonus > 0 && (
              <div className="breakdown-item">
                <span className="item-label">First Try Bonus</span>
                <span className="item-value positive">+{breakdown.accuracyBonus}</span>
              </div>
            )}

            {breakdown.wrongPenalty > 0 && (
              <div className="breakdown-item">
                <span className="item-label">Wrong Answer Penalty</span>
                <span className="item-value negative">-{breakdown.wrongPenalty}</span>
              </div>
            )}

            {breakdown.timeoutPenalty > 0 && (
              <div className="breakdown-item">
                <span className="item-label">Timeout Penalty</span>
                <span className="item-value negative">-{breakdown.timeoutPenalty}</span>
              </div>
            )}
          </div>
        </div>

        <div className="score-stats">
          <div className="stat">
            <span className="stat-label">Progress</span>
            <span className="stat-value">
              {attempt.completedSteps}/{attempt.totalSteps} steps
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Wrong Answers</span>
            <span className="stat-value">{attempt.wrongAttempts}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Difficulty</span>
            <span className="stat-value">{attempt.difficulty}</span>
          </div>
        </div>

        <div className="total-score-display">
          <span className="total-label">Your Total Score</span>
          <span className="total-value">{userTotalScore}</span>
        </div>

        <div className="summary-actions">
          <button className="action-btn retry-btn" onClick={onRetry}>
            Try Again
          </button>
          <button className="action-btn next-btn" onClick={onClose}>
            {attempt.completed ? 'Next Level' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
