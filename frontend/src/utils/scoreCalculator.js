import { getScoreConfig } from '../config/scoreConfig';

export function calculateScore(attempt) {
  const config = getScoreConfig(attempt.difficulty);

  const {
    basePoints,
    timeMultiplier,
    firstTryBonus,
    wrongAnswerPenalty,
    timeoutPenalty,
    partialBaseFraction,
  } = config;

  let finalScore = 0;
  const breakdown = {
    basePoints: 0,
    timeBonus: 0,
    accuracyBonus: 0,
    wrongPenalty: 0,
    timeoutPenalty: 0,
  };

  if (attempt.completed) {
    breakdown.basePoints = basePoints;
    breakdown.timeBonus = attempt.remainingTime * timeMultiplier;
    breakdown.accuracyBonus = attempt.wrongAttempts === 0 ? firstTryBonus : 0;
    breakdown.wrongPenalty = attempt.wrongAttempts * wrongAnswerPenalty;
    breakdown.timeoutPenalty = 0;

    finalScore =
      basePoints +
      breakdown.timeBonus +
      breakdown.accuracyBonus -
      breakdown.wrongPenalty;
  } else {
    const progressRatio = Math.min(
      1,
      attempt.completedSteps / attempt.totalSteps
    );
    breakdown.basePoints = Math.round(
      basePoints * partialBaseFraction * progressRatio
    );
    breakdown.timeBonus = 0;
    breakdown.accuracyBonus = 0;
    breakdown.wrongPenalty = attempt.wrongAttempts * wrongAnswerPenalty;
    breakdown.timeoutPenalty = attempt.completedSteps > 0 ? timeoutPenalty : 0;

    finalScore =
      breakdown.basePoints - breakdown.wrongPenalty - breakdown.timeoutPenalty;
  }

  finalScore = Math.max(0, finalScore);

  return {
    score: finalScore,
    breakdown,
  };
}

export function formatScore(score) {
  return score.toLocaleString();
}
