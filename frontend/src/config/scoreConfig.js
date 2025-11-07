export const scoreConfig = {
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

export function getScoreConfig(difficulty = 'Medium') {
  return scoreConfig[difficulty] || scoreConfig.Medium;
}
