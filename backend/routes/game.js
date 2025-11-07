const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attempt = require('../models/Attempt');
const UserScores = require('../models/UserScores');
const { calculateScore } = require('../utils/scoreCalculator');

// Save attempt
router.post('/attempt', auth, async (req, res) => {
  try {
    const {
      levelId,
      difficulty,
      completed,
      completedSteps,
      totalSteps,
      wrongAttempts,
      timeTaken,
      remainingTime,
      metadata,
    } = req.body;

    if (!levelId || !difficulty) {
      return res
        .status(400)
        .json({ error: 'levelId and difficulty are required' });
    }

    const attempt = new Attempt({
      userId: req.userId,
      levelId,
      difficulty,
      completed,
      completedSteps,
      totalSteps,
      wrongAttempts,
      timeTaken,
      remainingTime,
      metadata,
      score: 0,
    });

    const { score, breakdown } = calculateScore(attempt);
    attempt.score = score;

    await attempt.save();

    let userScores = await UserScores.findOne({ userId: req.userId });
    if (!userScores) {
      userScores = new UserScores({ userId: req.userId });
    }

    userScores.totalScore += score;
    userScores.attemptCount += 1;

    if (completed) {
      const existingBest = userScores.levelBestScores.find(
        (lb) => lb.levelId === levelId && lb.difficulty === difficulty
      );

      if (!existingBest || score > existingBest.bestScore) {
        if (existingBest) {
          existingBest.bestScore = score;
          existingBest.attemptId = attempt._id;
          existingBest.achievedAt = Date.now();
        } else {
          userScores.levelBestScores.push({
            levelId,
            difficulty,
            bestScore: score,
            attemptId: attempt._id,
            achievedAt: Date.now(),
          });
        }
      }
    }

    await userScores.save();

    res.status(201).json({
      attempt: attempt.toObject(),
      score,
      breakdown,
      userTotalScore: userScores.totalScore,
    });
  } catch (error) {
    console.error('Error saving attempt:', error);
    res.status(500).json({ error: 'Failed to save attempt' });
  }
});

// Get user's attempts
router.get('/attempts', auth, async (req, res) => {
  try {
    const { levelId, difficulty, limit = 10, skip = 0 } = req.query;

    const filter = { userId: req.userId };
    if (levelId) filter.levelId = levelId;
    if (difficulty) filter.difficulty = difficulty;

    const attempts = await Attempt.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Attempt.countDocuments(filter);

    res.json({ attempts, total });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// Get user scores
router.get('/scores', auth, async (req, res) => {
  try {
    const userScores = await UserScores.findOne({ userId: req.userId }).populate(
      'levelBestScores.attemptId'
    );

    if (!userScores) {
      return res.json({
        totalScore: 0,
        levelBestScores: [],
        attemptCount: 0,
      });
    }

    res.json(userScores.toObject());
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ error: 'Failed to fetch user scores' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { difficulty = 'Medium', limit = 50 } = req.query;

    const leaderboard = await UserScores.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          _id: 0,
          name: '$user.name',
          coins: '$totalScore',
          level: {
            $cond: {
              if: { $gte: ['$totalScore', 4000] },
              then: 25,
              else: {
                $cond: {
                  if: { $gte: ['$totalScore', 3000] },
                  then: 20,
                  else: {
                    $cond: {
                      if: { $gte: ['$totalScore', 2000] },
                      then: 15,
                      else: {
                        $cond: {
                          if: { $gte: ['$totalScore', 1000] },
                          then: 10,
                          else: 5,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          wins: '$attemptCount',
        },
      },
    ]).exec();

    leaderboard.forEach((player, index) => {
      player.rank = index + 1;
    });

    res.json({ leaderboard, difficulty });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get level best score
router.get('/level-best/:levelId/:difficulty', auth, async (req, res) => {
  try {
    const { levelId, difficulty } = req.params;

    const userScores = await UserScores.findOne({
      userId: req.userId,
      'levelBestScores.levelId': levelId,
      'levelBestScores.difficulty': difficulty,
    });

    if (!userScores) {
      return res.json({ bestScore: null });
    }

    const best = userScores.levelBestScores.find(
      (lb) => lb.levelId === levelId && lb.difficulty === difficulty
    );

    res.json({
      bestScore: best ? best.bestScore : null,
      attemptId: best ? best.attemptId : null,
    });
  } catch (error) {
    console.error('Error fetching level best:', error);
    res.status(500).json({ error: 'Failed to fetch level best' });
  }
});

module.exports = router;
