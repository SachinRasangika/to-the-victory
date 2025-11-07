import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { getScoreConfig } from '../config/scoreConfig';
import '../styles/live-score-preview.css';

export default function LiveScorePreview({
  timeRemaining,
  wrongAttempts = 0,
  difficulty = 'Medium',
  timeLimit = 16,
}) {
  const config = getScoreConfig(difficulty);

  const potentialScore = useMemo(() => {
    const basePoints = config.basePoints;
    const timeBonus = timeRemaining * config.timeMultiplier;
    const accuracyBonus = wrongAttempts === 0 ? config.firstTryBonus : 0;
    const wrongPenalty = wrongAttempts * config.wrongAnswerPenalty;

    return Math.max(0, basePoints + timeBonus + accuracyBonus - wrongPenalty);
  }, [timeRemaining, wrongAttempts, config]);

  const timePercentage = (timeRemaining / timeLimit) * 100;

  return (
    <div className="live-score-container">
      <div className="score-preview-header">
        <TrendingUp size={16} />
        <span className="preview-label">Potential Score</span>
      </div>
      <div className="score-preview-value">{potentialScore}</div>
      <div className="score-breakdown-mini">
        <div className="breakdown-item-mini">
          <span className="label">Base</span>
          <span className="value">{config.basePoints}</span>
        </div>
        <div className="breakdown-item-mini">
          <span className="label">Time</span>
          <span className="value">+{timeRemaining * config.timeMultiplier}</span>
        </div>
        {wrongAttempts === 0 && (
          <div className="breakdown-item-mini">
            <span className="label">First Try</span>
            <span className="value">+{config.firstTryBonus}</span>
          </div>
        )}
        {wrongAttempts > 0 && (
          <div className="breakdown-item-mini penalty">
            <span className="label">Wrong</span>
            <span className="value">-{wrongAttempts * config.wrongAnswerPenalty}</span>
          </div>
        )}
      </div>
      <div className="time-indicator">
        <div className="time-bar-background">
          <div
            className="time-bar-fill"
            style={{
              width: `${timePercentage}%`,
              backgroundColor: timePercentage > 50 ? '#34d399' : timePercentage > 25 ? '#fbbf24' : '#f87171',
            }}
          ></div>
        </div>
        <span className="time-text">{timeRemaining}s remaining</span>
      </div>
    </div>
  );
}
