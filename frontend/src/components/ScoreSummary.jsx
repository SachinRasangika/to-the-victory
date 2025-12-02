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
        <div className="summary-header-compact">
          {attempt.completed ? (
            <>
              <Award size={28} className="summary-icon success" />
              <h2 className="summary-title-compact">
                {isFirstTry ? '🎉 Perfect!' : '✅ Complete!'}
              </h2>
            </>
          ) : (
            <>
              <TrendingUp size={28} className="summary-icon partial" />
              <h2 className="summary-title-compact">Good Try!</h2>
            </>
          )}
        </div>

        <div className="score-display-compact">
          <span className="score-value-compact">+{points}</span>
          <span className="score-label-compact">points</span>
        </div>

        {isBestScore && (
          <div className="best-score-badge-compact">✨ Personal Best!</div>
        )}

        <div className="total-score-mini">
          <span className="total-value-mini">{userTotalScore}</span>
          <span className="total-label-mini">total score</span>
        </div>

        <div className="summary-actions-compact">
          <button className="action-btn-compact retry-btn-compact" onClick={onRetry}>
            Retry
          </button>
          <button className="action-btn-compact next-btn-compact" onClick={onClose}>
            {attempt.completed ? 'Next' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
