import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, Mail, Lock } from 'lucide-react';
import '../styles/chronicles-auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
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
                  placeholder="Enter your seal"
                  required
                />
              </div>
            </div>

            {error && <div className="chronicles-error">{error}</div>}

            <button type="submit" className="chronicles-submit" disabled={loading}>
              {loading ? 'Entering...' : 'Enter the Kingdom'}
            </button>
          </form>

          <div className="chronicles-divider">
            <span>or</span>
          </div>

          <div className="chronicles-footer">
            <p>
              Not a member?{' '}
              <Link to="/signup" className="chronicles-link">
                Join the Royal Court
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
