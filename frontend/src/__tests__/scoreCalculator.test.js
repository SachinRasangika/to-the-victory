import { calculateScore } from '../utils/scoreCalculator';

describe('Score Calculator', () => {
  describe('Completed Level - Easy', () => {
    it('should calculate score for first-try easy level with time bonus', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 10,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown.basePoints).toBe(100);
      expect(breakdown.timeBonus).toBe(50); // 10 * 5
      expect(breakdown.accuracyBonus).toBe(50);
      expect(breakdown.wrongPenalty).toBe(0);
      expect(score).toBe(200);
    });

    it('should apply wrong answer penalty', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 2,
        remainingTime: 8,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown.basePoints).toBe(100);
      expect(breakdown.timeBonus).toBe(40); // 8 * 5
      expect(breakdown.accuracyBonus).toBe(0); // No bonus on wrong attempts
      expect(breakdown.wrongPenalty).toBe(20); // 2 * 10
      expect(score).toBe(120);
    });

    it('should clamp negative scores to zero', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 20,
        remainingTime: 0,
      };

      const { score } = calculateScore(attempt);

      expect(score).toBe(0);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Completed Level - Medium', () => {
    it('should calculate perfect medium level score', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 7,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown.basePoints).toBe(200);
      expect(breakdown.timeBonus).toBe(35); // 7 * 5
      expect(breakdown.accuracyBonus).toBe(50);
      expect(score).toBe(285);
    });

    it('should calculate medium level with penalties', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 3,
        remainingTime: 5,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown.basePoints).toBe(200);
      expect(breakdown.timeBonus).toBe(25); // 5 * 5
      expect(breakdown.accuracyBonus).toBe(0);
      expect(breakdown.wrongPenalty).toBe(45); // 3 * 15
      expect(score).toBe(180);
    });
  });

  describe('Completed Level - Hard', () => {
    it('should calculate perfect hard level score', () => {
      const attempt = {
        difficulty: 'Hard',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 12,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown.basePoints).toBe(300);
      expect(breakdown.timeBonus).toBe(60); // 12 * 5
      expect(breakdown.accuracyBonus).toBe(50);
      expect(score).toBe(410);
    });
  });

  describe('Incomplete Level - Partial Credit', () => {
    it('should award partial credit for easy level (2/4 steps)', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: false,
        completedSteps: 2,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const { score, breakdown } = calculateScore(attempt);

      // partialBaseFraction = 0.5, so: 100 * 0.5 * (2/4) = 25
      expect(breakdown.basePoints).toBe(25);
      expect(breakdown.timeBonus).toBe(0);
      expect(breakdown.accuracyBonus).toBe(0);
      expect(breakdown.wrongPenalty).toBe(0);
      expect(score).toBe(25);
    });

    it('should apply penalties to partial credit', () => {
      const attempt = {
        difficulty: 'Hard',
        completed: false,
        completedSteps: 2,
        totalSteps: 4,
        wrongAttempts: 1,
        remainingTime: 0,
      };

      const { score, breakdown } = calculateScore(attempt);

      // partialBaseFraction = 0.5, so: 300 * 0.5 * (2/4) = 75
      // wrongPenalty = 1 * 20 = 20
      // timeoutPenalty = 100 (because completedSteps > 0)
      expect(breakdown.basePoints).toBe(75);
      expect(breakdown.wrongPenalty).toBe(20);
      expect(breakdown.timeoutPenalty).toBe(100);
      expect(score).toBe(Math.max(0, 75 - 20 - 100));
    });

    it('should clamp partial score to zero', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: false,
        completedSteps: 1,
        totalSteps: 4,
        wrongAttempts: 10,
        remainingTime: 0,
      };

      const { score } = calculateScore(attempt);

      expect(score).toBe(0);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should not apply timeout penalty when no steps completed', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: false,
        completedSteps: 0,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown.basePoints).toBe(0); // 200 * 0.5 * (0/4)
      expect(breakdown.timeoutPenalty).toBe(0); // No penalty when no steps completed
      expect(score).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero remaining time', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown.timeBonus).toBe(0);
      expect(score).toBe(150); // basePoints + accuracyBonus
    });

    it('should handle invalid difficulty gracefully', () => {
      const attempt = {
        difficulty: 'Invalid',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 5,
      };

      expect(() => calculateScore(attempt)).toThrow();
    });

    it('should handle maximum steps', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: false,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const { score, breakdown } = calculateScore(attempt);

      // progressRatio = 4/4 = 1, so full partial credit
      expect(breakdown.basePoints).toBe(100); // 200 * 0.5 * 1
      expect(score).toBe(0); // 100 - 100 timeout penalty
    });
  });

  describe('Breakdown Validation', () => {
    it('should return valid breakdown structure', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 1,
        remainingTime: 5,
      };

      const { score, breakdown } = calculateScore(attempt);

      expect(breakdown).toHaveProperty('basePoints');
      expect(breakdown).toHaveProperty('timeBonus');
      expect(breakdown).toHaveProperty('accuracyBonus');
      expect(breakdown).toHaveProperty('wrongPenalty');
      expect(breakdown).toHaveProperty('timeoutPenalty');

      expect(typeof score).toBe('number');
      expect(typeof breakdown.basePoints).toBe('number');
      expect(typeof breakdown.timeBonus).toBe('number');
      expect(typeof breakdown.accuracyBonus).toBe('number');
      expect(typeof breakdown.wrongPenalty).toBe('number');
      expect(typeof breakdown.timeoutPenalty).toBe('number');
    });
  });
});
