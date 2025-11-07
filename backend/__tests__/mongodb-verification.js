const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const UserScores = require('../models/UserScores');
const Attempt = require('../models/Attempt');

async function verifyMongoDB() {
  console.log('🔍 MongoDB Verification Report\n');
  console.log('=' .repeat(70));
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.log('❌ MONGO_URI not configured');
      process.exit(1);
    }

    console.log('📍 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully\n');

    // Get collection stats
    const userCount = await User.countDocuments();
    const attemptCount = await Attempt.countDocuments();
    const userScoresCount = await UserScores.countDocuments();

    console.log('📊 COLLECTION STATISTICS');
    console.log('-'.repeat(70));
    console.log(`  Users Collection:      ${userCount} documents`);
    console.log(`  Attempts Collection:   ${attemptCount} documents`);
    console.log(`  UserScores Collection: ${userScoresCount} documents`);
    console.log();

    // Get all users
    if (userCount > 0) {
      console.log('👤 USERS IN DATABASE');
      console.log('-'.repeat(70));
      const users = await User.find().select('_id name email createdAt -password');
      users.forEach((user, idx) => {
        console.log(`  ${idx + 1}. ${user.name}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     ID: ${user._id}`);
        console.log(`     Created: ${user.createdAt.toISOString()}\n`);
      });
    }

    // Get all attempts
    if (attemptCount > 0) {
      console.log('🎮 GAME ATTEMPTS IN DATABASE');
      console.log('-'.repeat(70));
      const attempts = await Attempt.find().populate('userId', 'name email');
      attempts.forEach((attempt, idx) => {
        const userName = attempt.userId?.name || 'Unknown';
        console.log(`  ${idx + 1}. ${userName} - Level ${attempt.levelId} (${attempt.difficulty})`);
        console.log(`     Score: ${attempt.score} | Completed: ${attempt.completed ? '✅' : '❌'}`);
        console.log(`     Steps: ${attempt.completedSteps}/${attempt.totalSteps} | Wrong: ${attempt.wrongAttempts}`);
        console.log(`     Time: ${attempt.timeTaken}s | Created: ${attempt.createdAt.toISOString()}\n`);
      });
    }

    // Get all user scores
    if (userScoresCount > 0) {
      console.log('🏆 USER SCORES IN DATABASE');
      console.log('-'.repeat(70));
      const scores = await UserScores.find().populate('userId', 'name email');
      scores.forEach((score, idx) => {
        const userName = score.userId?.name || 'Unknown';
        console.log(`  ${idx + 1}. ${userName}`);
        console.log(`     Total Score: ${score.totalScore}`);
        console.log(`     Attempts: ${score.attemptCount}`);
        if (score.levelBestScores && score.levelBestScores.length > 0) {
          console.log(`     Best Scores:`);
          score.levelBestScores.forEach(best => {
            console.log(`       - Level ${best.levelId} (${best.difficulty}): ${best.bestScore} pts`);
          });
        }
        console.log(`     Updated: ${score.updatedAt.toISOString()}\n`);
      });
    }

    console.log('=' .repeat(70));
    console.log('✅ MongoDB verification complete!\n');

    if (userCount === 0 && attemptCount === 0 && userScoresCount === 0) {
      console.log('⚠️  No data found in database. Create some by:');
      console.log('    1. Signing up a user in the app');
      console.log('    2. Playing a game level\n');
    }

    console.log('📋 Summary:');
    console.log(`   MongoDB Connection: ✅ Working`);
    console.log(`   Data Storage: ${(userCount + attemptCount + userScoresCount) > 0 ? '✅ Working' : '⚠️  Empty'}`);
    console.log(`   Models Loaded: ✅ User, Attempt, UserScores\n`);

  } catch (error) {
    console.error('❌ MongoDB Verification Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

verifyMongoDB();
