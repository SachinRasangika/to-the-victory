// Password strength requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

/**
 * Validates if a password meets all strong password requirements
 * @param {string} password - The password to validate
 * @returns {object} Object with isValid flag and array of failed requirements
 */
export function validatePasswordStrength(password) {
  const failures = [];

  if (!password || password.length < PASSWORD_REQUIREMENTS.minLength) {
    failures.push(`At least ${PASSWORD_REQUIREMENTS.minLength} characters`);
  }

  if (!PASSWORD_REQUIREMENTS.uppercase.test(password)) {
    failures.push('At least one uppercase letter (A-Z)');
  }

  if (!PASSWORD_REQUIREMENTS.lowercase.test(password)) {
    failures.push('At least one lowercase letter (a-z)');
  }

  if (!PASSWORD_REQUIREMENTS.number.test(password)) {
    failures.push('At least one number (0-9)');
  }

  if (!PASSWORD_REQUIREMENTS.special.test(password)) {
    failures.push('At least one special character (!@#$%^&*...)');
  }

  return {
    isValid: failures.length === 0,
    failures,
    strength: getPasswordStrength(password, failures.length),
  };
}

/**
 * Calculates password strength level
 * @param {string} password - The password to evaluate
 * @param {number} failureCount - Number of requirement failures
 * @returns {string} Strength level: 'weak', 'fair', 'good', 'strong'
 */
function getPasswordStrength(password, failureCount) {
  if (!password) return 'weak';
  if (failureCount >= 4) return 'weak';
  if (failureCount >= 2) return 'fair';
  if (failureCount >= 1) return 'good';
  return 'strong';
}

/**
 * Gets a user-friendly message about password requirements
 * @returns {string} Message describing password requirements
 */
export function getPasswordRequirementsText() {
  return `Password must contain at least ${PASSWORD_REQUIREMENTS.minLength} characters, including uppercase, lowercase, numbers, and special characters.`;
}
