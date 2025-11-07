const mongoose = require('mongoose');

const levelBestScoreSchema = new mongoose.Schema({
  levelId: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  bestScore: {
    type: Number,
    required: true,
    min: 0,
  },
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt',
  },
  achievedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const userScoresSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  totalScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  levelBestScores: [levelBestScoreSchema],
  attemptCount: {
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

userScoresSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserScores', userScoresSchema);
