import { validatePasswordStrength } from '../utils/passwordStrength';
import '../styles/password-strength-meter.css';

export default function PasswordStrengthMeter({ password, showRequirements = true }) {
  const validation = validatePasswordStrength(password);
  const { isValid, failures, strength } = validation;

  if (!password) return null;

  return (
    <div className="password-strength-container">
      <div className={`strength-meter strength-${strength}`}>
        <div className="strength-bar"></div>
      </div>
      
      <p className={`strength-text strength-${strength}`}>
        Strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
      </p>

      {showRequirements && (
        <div className="requirements-list">
          <p className="requirements-title">Password Requirements:</p>
          <ul>
            <li className={password.length >= 8 ? 'met' : 'unmet'}>
              ✓ At least 8 characters
            </li>
            <li className={/[A-Z]/.test(password) ? 'met' : 'unmet'}>
              ✓ One uppercase letter
            </li>
            <li className={/[a-z]/.test(password) ? 'met' : 'unmet'}>
              ✓ One lowercase letter
            </li>
            <li className={/[0-9]/.test(password) ? 'met' : 'unmet'}>
              ✓ One number
            </li>
            <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'met' : 'unmet'}>
              ✓ One special character
            </li>
          </ul>
        </div>
      )}

      {!isValid && failures.length > 0 && (
        <div className="validation-errors">
          {failures.map((failure, idx) => (
            <p key={idx} className="error-message">• {failure}</p>
          ))}
        </div>
      )}
    </div>
  );
}
