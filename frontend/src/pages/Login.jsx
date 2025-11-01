import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      navigate('/throne');
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
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.832 8.70929C30.9471 8.50024 31.1161 8.32592 31.3216 8.2045C31.527 8.08309 31.7613 8.01904 32 8.01904C32.2386 8.01904 32.4729 8.08309 32.6783 8.2045C32.8838 8.32592 33.0528 8.50024 33.1679 8.70929L41.04 23.6533C41.2277 23.9993 41.4897 24.2995 41.8072 24.5323C42.1247 24.765 42.4897 24.9246 42.8762 24.9996C43.2627 25.0745 43.661 25.063 44.0424 24.9658C44.4239 24.8685 44.7792 24.6881 45.0826 24.4373L56.4879 14.6666C56.7069 14.4886 56.9767 14.3845 57.2585 14.3696C57.5403 14.3546 57.8196 14.4294 58.0562 14.5833C58.2928 14.7372 58.4744 14.9621 58.575 15.2258C58.6756 15.4895 58.6899 15.7783 58.6159 16.0506L51.0586 43.3733C50.9043 43.9324 50.572 44.426 50.112 44.7792C49.6519 45.1324 49.0893 45.326 48.5093 45.3306H15.4933C14.9128 45.3266 14.3496 45.1332 13.889 44.78C13.4284 44.4267 13.0957 43.9328 12.9413 43.3733L5.38662 16.0533C5.31262 15.781 5.32694 15.4922 5.42753 15.2285C5.52811 14.9648 5.70977 14.7398 5.94635 14.586C6.18294 14.4321 6.46224 14.3573 6.74406 14.3722C7.02588 14.3872 7.29568 14.4912 7.51462 14.6693L18.9173 24.44C19.2207 24.6907 19.576 24.8712 19.9575 24.9684C20.3389 25.0657 20.7372 25.0772 21.1237 25.0023C21.5102 24.9273 21.8752 24.7677 22.1927 24.5349C22.5102 24.3022 22.7722 24.002 22.9599 23.656L30.832 8.70929Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.3334 56H50.6667" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3333 5.83325L10.8408 10.6058C10.5865 10.7534 10.2977 10.8312 10.0037 10.8312C9.70968 10.8312 9.42088 10.7534 9.16663 10.6058L1.66663 5.83325" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.6666 3.33325H3.33329C2.41282 3.33325 1.66663 4.07944 1.66663 4.99992V14.9999C1.66663 15.9204 2.41282 16.6666 3.33329 16.6666H16.6666C17.5871 16.6666 18.3333 15.9204 18.3333 14.9999V4.99992C18.3333 4.07944 17.5871 3.33325 16.6666 3.33325Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.8333 9.16675H4.16667C3.24619 9.16675 2.5 9.91294 2.5 10.8334V16.6667C2.5 17.5872 3.24619 18.3334 4.16667 18.3334H15.8333C16.7538 18.3334 17.5 17.5872 17.5 16.6667V10.8334C17.5 9.91294 16.7538 9.16675 15.8333 9.16675Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83337 9.16675V5.83341C5.83337 4.72835 6.27236 3.66854 7.05376 2.88714C7.83516 2.10573 8.89497 1.66675 10 1.66675C11.1051 1.66675 12.1649 2.10573 12.9463 2.88714C13.7277 3.66854 14.1667 4.72835 14.1667 5.83341V9.16675" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
