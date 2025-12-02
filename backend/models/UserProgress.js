const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  levels: [
    {
      levelId: {
        type: String,
        required: true,
      },
      levelName: {
        type: String,
        required: true,
      },
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
      },
      unlocked: {
        type: Boolean,
        default: false,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      bestScore: {
        type: Number,
        default: 0,
      },
      completedAt: {
        type: Date,
        default: null,
      },
      attempts: {
        type: Number,
        default: 0,
      },
    },
  ],
  currentLevel: {
    type: String,
    default: 'level-1',
  },
  totalLevelsCompleted: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
