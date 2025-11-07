const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  levelId: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedSteps: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSteps: {
    type: Number,
    required: true,
    min: 1,
  },
  wrongAttempts: {
    type: Number,
    default: 0,
    min: 0,
  },
  timeTaken: {
    type: Number,
    required: true,
    min: 0,
  },
  remainingTime: {
    type: Number,
    required: true,
    min: 0,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('Attempt', attemptSchema);
