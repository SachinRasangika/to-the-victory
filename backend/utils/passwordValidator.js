const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

/**
 * Validates if a password meets strong password requirements
 * @param {string} password - The password to validate
 * @returns {object} Object with isValid flag and array of error messages
 */
function validatePasswordStrength(password) {
  const errors = [];

  if (!password || password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`);
  }

  if (!PASSWORD_REQUIREMENTS.uppercase.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }

  if (!PASSWORD_REQUIREMENTS.lowercase.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }

  if (!PASSWORD_REQUIREMENTS.number.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }

  if (!PASSWORD_REQUIREMENTS.special.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = { validatePasswordStrength };
