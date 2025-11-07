const { calculateScore } = require('../utils/scoreCalculator');

describe('Backend Score Calculator', () => {
  describe('Completed Level - Easy', () => {
    it('should calculate score for first-try easy level', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 10,
      };

      const result = calculateScore(attempt);

      expect(result.score).toBe(200);
      expect(result.breakdown.basePoints).toBe(100);
      expect(result.breakdown.timeBonus).toBe(50);
      expect(result.breakdown.accuracyBonus).toBe(50);
      expect(result.breakdown.wrongPenalty).toBe(0);
      expect(result.breakdown.timeoutPenalty).toBe(0);
    });

    it('should apply wrong answer penalties', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 2,
        remainingTime: 5,
      };

      const result = calculateScore(attempt);

      expect(result.score).toBe(135); // 100 + 25 + 0 - 20
      expect(result.breakdown.wrongPenalty).toBe(20);
    });

    it('should never return negative score', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 100,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      expect(result.score).toBe(0);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Completed Level - Medium', () => {
    it('should calculate perfect medium level as per spec example', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 7,
      };

      const result = calculateScore(attempt);

      // Example from spec: 200 + 35 + 50 = 285
      expect(result.score).toBe(285);
      expect(result.breakdown.basePoints).toBe(200);
      expect(result.breakdown.timeBonus).toBe(35);
      expect(result.breakdown.accuracyBonus).toBe(50);
    });

    it('should handle medium difficulty penalties', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 2,
        remainingTime: 3,
      };

      const result = calculateScore(attempt);

      // 200 + 15 + 0 - 30 = 185
      expect(result.score).toBe(185);
      expect(result.breakdown.wrongPenalty).toBe(30);
    });
  });

  describe('Completed Level - Hard', () => {
    it('should calculate high value for perfect hard level', () => {
      const attempt = {
        difficulty: 'Hard',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 15,
      };

      const result = calculateScore(attempt);

      // 300 + 75 + 50 = 425
      expect(result.score).toBe(425);
      expect(result.breakdown.basePoints).toBe(300);
      expect(result.breakdown.timeBonus).toBe(75);
    });
  });

  describe('Incomplete Level - Partial Credit', () => {
    it('should calculate partial credit as per spec example', () => {
      const attempt = {
        difficulty: 'Hard',
        completed: false,
        completedSteps: 2,
        totalSteps: 4,
        wrongAttempts: 1,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      // partialPoints = 300 * 0.5 * (2/4) = 75
      // score = 75 - 20 - 100 = -45, clamped to 0
      // But spec shows: 75 - 20 = 55
      // So timeout penalty might not apply in this case
      expect(result.score).toBe(55);
      expect(result.breakdown.basePoints).toBe(75);
      expect(result.breakdown.wrongPenalty).toBe(20);
    });

    it('should award partial credit for easy level with progress', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: false,
        completedSteps: 2,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      // 100 * 0.5 * (2/4) = 25
      expect(result.score).toBe(25);
      expect(result.breakdown.basePoints).toBe(25);
      expect(result.breakdown.timeoutPenalty).toBe(50); // Applied because completedSteps > 0
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

      const result = calculateScore(attempt);

      expect(result.score).toBe(0);
      expect(result.breakdown.basePoints).toBe(0);
      expect(result.breakdown.timeoutPenalty).toBe(0);
    });

    it('should clamp partial score to zero', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: false,
        completedSteps: 1,
        totalSteps: 4,
        wrongAttempts: 5,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      // 100 * 0.5 * (1/4) = 12.5
      // 12.5 - 50 - 50 = negative, clamped to 0
      expect(result.score).toBe(0);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Result Structure', () => {
    it('should return score, breakdown, and config', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 5,
      };

      const result = calculateScore(attempt);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('breakdown');
      expect(result).toHaveProperty('config');

      expect(typeof result.score).toBe('number');
      expect(typeof result.breakdown).toBe('object');
      expect(typeof result.config).toBe('object');

      expect(result.config.difficulty).toBe('Easy');
      expect(result.config.basePoints).toBe(100);
    });

    it('should include all breakdown components', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 1,
        remainingTime: 8,
      };

      const result = calculateScore(attempt);

      expect(result.breakdown).toHaveProperty('basePoints');
      expect(result.breakdown).toHaveProperty('timeBonus');
      expect(result.breakdown).toHaveProperty('accuracyBonus');
      expect(result.breakdown).toHaveProperty('wrongPenalty');
      expect(result.breakdown).toHaveProperty('timeoutPenalty');
    });
  });

  describe('Config Variations', () => {
    it('should handle all three difficulty levels', () => {
      const difficulties = ['Easy', 'Medium', 'Hard'];

      difficulties.forEach((difficulty) => {
        const attempt = {
          difficulty,
          completed: true,
          completedSteps: 4,
          totalSteps: 4,
          wrongAttempts: 0,
          remainingTime: 5,
        };

        const result = calculateScore(attempt);

        expect(result.score).toBeGreaterThan(0);
        expect(result.config.difficulty).toBe(difficulty);
      });
    });

    it('should reject invalid difficulty', () => {
      const attempt = {
        difficulty: 'Impossible',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 5,
      };

      expect(() => calculateScore(attempt)).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero remaining time on completion', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      expect(result.breakdown.timeBonus).toBe(0);
      expect(result.score).toBe(150); // 100 + 50, no time bonus
    });

    it('should handle large wrong attempts count', () => {
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 50,
        remainingTime: 10,
      };

      const result = calculateScore(attempt);

      expect(result.score).toBe(0);
      expect(result.breakdown.wrongPenalty).toBe(750);
    });

    it('should handle single step completion', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: false,
        completedSteps: 1,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      // 100 * 0.5 * (1/4) = 12.5 → 12 (rounded)
      expect(result.score).toBeGreaterThan(0);
      expect(result.breakdown.basePoints).toBeGreaterThan(0);
    });

    it('should handle maximum steps on incomplete', () => {
      const attempt = {
        difficulty: 'Easy',
        completed: false,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      // progressRatio clamps to 1, so: 100 * 0.5 * 1 = 50
      // then - 50 timeout = 0
      expect(result.score).toBe(0);
    });
  });

  describe('Spec Compliance', () => {
    it('should match example 1 from specification', () => {
      // "Completed Medium level, first try, remaining time 7s"
      // Expected: 285
      const attempt = {
        difficulty: 'Medium',
        completed: true,
        completedSteps: 4,
        totalSteps: 4,
        wrongAttempts: 0,
        remainingTime: 7,
      };

      const result = calculateScore(attempt);

      expect(result.score).toBe(285);
      expect(result.breakdown.basePoints).toBe(200);
      expect(result.breakdown.timeBonus).toBe(35);
      expect(result.breakdown.accuracyBonus).toBe(50);
    });

    it('should match example 2 from specification', () => {
      // "Failed Hard level before final step; completed 2/4 steps; 1 wrong attempt"
      // Expected: 55
      const attempt = {
        difficulty: 'Hard',
        completed: false,
        completedSteps: 2,
        totalSteps: 4,
        wrongAttempts: 1,
        remainingTime: 0,
      };

      const result = calculateScore(attempt);

      expect(result.score).toBe(55);
      expect(result.breakdown.basePoints).toBe(75);
      expect(result.breakdown.wrongPenalty).toBe(20);
      expect(result.breakdown.timeoutPenalty).toBe(100);
    });
  });
});
