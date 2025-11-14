const fs = require('fs');
const path = require('path');

const BANANA_API_URL = 'https://marcconrad.com/uob/banana/api.php';
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 5000;
const FALLBACK_DIR = path.join(__dirname, '../public/fallback');

/**
 * Fetch a puzzle from the Banana API with retry logic
 */
async function fetchFromBananaAPI() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(BANANA_API_URL, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched puzzle from Banana API (attempt ${attempt})`);
      return data;
    } catch (error) {
      console.warn(
        `⚠️ Banana API fetch failed (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`
      );

      if (attempt === MAX_RETRIES) {
        console.warn(
          `❌ All ${MAX_RETRIES} attempts to fetch from Banana API failed. Using fallback puzzle.`
        );
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

/**
 * Get a random fallback puzzle from the fallback directory
 */
function getFallbackPuzzle() {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      console.warn(
        `⚠️ Fallback directory does not exist: ${FALLBACK_DIR}. Creating it now.`
      );
      return getDefaultFallbackPuzzle();
    }

    const files = fs.readdirSync(FALLBACK_DIR).filter((file) =>
      file.endsWith('.json')
    );

    if (files.length === 0) {
      console.warn(
        `⚠️ No fallback puzzles found in ${FALLBACK_DIR}. Using default fallback.`
      );
      return getDefaultFallbackPuzzle();
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(FALLBACK_DIR, randomFile);
    const puzzle = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.warn(`⚠️ Using fallback puzzle: ${randomFile}`);
    return puzzle;
  } catch (error) {
    console.error(`💥 Error loading fallback puzzle: ${error.message}`);
    return getDefaultFallbackPuzzle();
  }
}

/**
 * Get a default fallback puzzle (hardcoded)
 */
function getDefaultFallbackPuzzle() {
  console.warn(
    `⚠️ Using hardcoded default fallback puzzle`
  );
  return {
    image: '/fallback/puzzle_default.png',
    solution: 7,
    source: 'fallback',
  };
}

/**
 * Main function: Get a banana puzzle, with fallback if API fails
 */
async function getBananaPuzzle() {
  console.log('🍌 Fetching Banana puzzle...');

  const puzzle = await fetchFromBananaAPI();

  if (puzzle) {
    return puzzle;
  }

  return getFallbackPuzzle();
}

module.exports = {
  getBananaPuzzle,
  getFallbackPuzzle,
};
