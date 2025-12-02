import { api, getToken } from './api';

export const initializeUserProgress = async () => {
  try {
    return await api('/api/game/progress/init', {
      method: 'POST',
      token: getToken(),
    });
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw error;
  }
};

export const getUserProgress = async () => {
  try {
    try {
      return await api('/api/game/progress', {
        method: 'GET',
        token: getToken(),
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return await initializeUserProgress();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const completeLevelAndUnlockNext = async (levelId, score) => {
  try {
    return await api('/api/game/progress/complete-level', {
      method: 'POST',
      body: { levelId, score },
      token: getToken(),
    });
  } catch (error) {
    console.error('Error completing level:', error);
    throw error;
  }
};

export const getLevelConfig = () => {
  return [
    {
      levelId: 'level-1',
      levelName: "The Castle Gate – The Guard's Challenge",
      difficulty: 'Easy',
    },
    {
      levelId: 'level-2',
      levelName: "Meeting the King's Manager",
      difficulty: 'Medium',
    },
    {
      levelId: 'level-3',
      levelName: 'Meeting the King Himself',
      difficulty: 'Hard',
    },
  ];
};
