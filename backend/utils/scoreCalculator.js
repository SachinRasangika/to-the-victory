const scoreConfig = {
  Easy: {
    basePoints: 100,
    timeMultiplier: 5,
    firstTryBonus: 50,
    wrongAnswerPenalty: 10,
    timeoutPenalty: 50,
    partialBaseFraction: 0.5,
  },
  Medium: {
    basePoints: 200,
    timeMultiplier: 5,
    firstTryBonus: 50,
    wrongAnswerPenalty: 15,
    timeoutPenalty: 75,
    partialBaseFraction: 0.5,
  },
  Hard: {
    basePoints: 300,
    timeMultiplier: 5,
    firstTryBonus: 50,
    wrongAnswerPenalty: 20,
    timeoutPenalty: 100,
    partialBaseFraction: 0.5,
  },
};

function calculateScore(attempt) {
  const config = scoreConfig[attempt.difficulty];
  if (!config) {
    throw new Error(`Invalid difficulty: ${attempt.difficulty}`);
  }

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
    breakdown.basePoints = basePoints * partialBaseFraction * progressRatio;
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
    config: {
      difficulty: attempt.difficulty,
      ...config,
    },
  };
}

function getScoreConfig(difficulty) {
  return scoreConfig[difficulty] || scoreConfig.Easy;
}

module.exports = {
  calculateScore,
  getScoreConfig,
  scoreConfig,
};
