import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, User, Mail, Lock } from 'lucide-react';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { validatePasswordStrength } from '../utils/passwordStrength';
import '../styles/chronicles-auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.failures.join(', '));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chronicles-page">
      <div className="chronicles-bg-overlay"></div>
      
      <div className="chronicles-container">
        <div className="crown-container">
          <Crown size={64} color="#FBBF24" strokeWidth={1.5} />
        </div>

        <div className="chronicles-title-section">
          <div className="title-line"></div>
          <h1 className="chronicles-title">Chronicles of Sri Lanka</h1>
          <div className="title-line"></div>
        </div>

        <p className="chronicles-subtitle">
          Step into a realm of ancient glory, where kings ruled with wisdom and warriors fought with
        </p>

        <div className="chronicles-card">
          <form className="chronicles-form" onSubmit={handleSubmit}>
            <div className="chronicles-field">
              <label htmlFor="name">Royal Name</label>
              <div className="input-wrapper">
                <User size={20} color="#D97706" strokeWidth={2} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Choose your name"
                  required
                />
              </div>
            </div>

            <div className="chronicles-field">
              <label htmlFor="email">Royal Scroll (Email)</label>
              <div className="input-wrapper">
                <Mail size={20} color="#D97706" strokeWidth={2} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@kingdom.lk"
                  required
                />
              </div>
            </div>

            <div className="chronicles-field">
              <label htmlFor="password">Secret Seal</label>
              <div className="input-wrapper">
                <Lock size={20} color="#D97706" strokeWidth={2} className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create your seal"
                  minLength="8"
                  required
                />
              </div>
              {formData.password && <PasswordStrengthMeter password={formData.password} />}
            </div>

            <div className="chronicles-field">
              <label htmlFor="confirmPassword">Confirm Seal</label>
              <div className="input-wrapper">
                <Lock size={20} color="#D97706" strokeWidth={2} className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your seal"
                  minLength="6"
                  required
                />
              </div>
            </div>

            {error && <div className="chronicles-error">{error}</div>}

            <button type="submit" className="chronicles-submit" disabled={loading}>
              {loading ? 'Joining...' : 'Join the Kingdom'}
            </button>
          </form>

          <div className="chronicles-divider">
            <span>or</span>
          </div>

          <div className="chronicles-footer">
            <p>
              Already a member?{' '}
              <Link to="/login" className="chronicles-link">
                Enter the Gates
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
