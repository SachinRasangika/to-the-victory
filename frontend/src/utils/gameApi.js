import { api, getToken } from '../services/api';

export async function saveAttempt(attemptData) {
  return api('/api/game/attempt', {
    method: 'POST',
    body: attemptData,
    token: getToken(),
  });
}

export async function getUserAttempts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.levelId) params.append('levelId', filters.levelId);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.skip) params.append('skip', filters.skip);

  const queryString = params.toString();
  const url = queryString ? `/api/game/attempts?${queryString}` : '/api/game/attempts';

  return api(url, {
    method: 'GET',
    token: getToken(),
  });
}

export async function getUserScores() {
  return api('/api/game/scores', {
    method: 'GET',
    token: getToken(),
  });
}

export async function getLeaderboard(difficulty = 'Medium', limit = 50) {
  return api(
    `/api/game/leaderboard?difficulty=${difficulty}&limit=${limit}`,
    {
      method: 'GET',
    }
  );
}

export async function getLevelBestScore(levelId, difficulty) {
  return api(
    `/api/game/level-best/${levelId}/${difficulty}`,
    {
      method: 'GET',
      token: getToken(),
    }
  );
}
