import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/throne-room.css';

export default function ThroneRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="throne-room-bg">
      <div className="throne-room-overlay">
        <header className="throne-header">
          <div className="crown-header">
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30.8321 8.70929C30.9472 8.50024 31.1163 8.32592 31.3217 8.2045C31.5272 8.08309 31.7614 8.01904 32.0001 8.01904C32.2387 8.01904 32.473 8.08309 32.6784 8.2045C32.8839 8.32592 33.053 8.50024 33.1681 8.70929L41.0401 23.6533C41.2278 23.9993 41.4898 24.2995 41.8073 24.5323C42.1248 24.765 42.4899 24.9246 42.8763 24.9996C43.2628 25.0745 43.6611 25.063 44.0426 24.9658C44.424 24.8685 44.7793 24.6881 45.0827 24.4373L56.4881 14.6666C56.707 14.4886 56.9768 14.3845 57.2586 14.3696C57.5404 14.3546 57.8198 14.4294 58.0563 14.5833C58.2929 14.7372 58.4746 14.9621 58.5752 15.2258C58.6757 15.4895 58.6901 15.7783 58.6161 16.0506L51.0587 43.3733C50.9045 43.9324 50.5721 44.426 50.1121 44.7792C49.652 45.1324 49.0894 45.326 48.5094 45.3306H15.4934C14.913 45.3266 14.3497 45.1332 13.8891 44.78C13.4285 44.4267 13.0958 43.9328 12.9414 43.3733L5.38674 16.0533C5.31274 15.781 5.32706 15.4922 5.42765 15.2285C5.52823 14.9648 5.70989 14.7398 5.94648 14.586C6.18306 14.4321 6.46236 14.3573 6.74418 14.3722C7.026 14.3872 7.2958 14.4912 7.51474 14.6693L18.9174 24.44C19.2209 24.6907 19.5761 24.8712 19.9576 24.9684C20.3391 25.0657 20.7373 25.0772 21.1238 25.0023C21.5103 24.9273 21.8754 24.7677 22.1929 24.5349C22.5103 24.3022 22.7723 24.002 22.9601 23.656L30.8321 8.70929Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 56H50.6666" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="throne-title">
            <h1>Welcome to the Kingdom</h1>
            {user && <p className="throne-subtitle">Hail, {user.name}!</p>}
          </div>
          <button onClick={handleLogout} className="throne-logout">
            Leave Kingdom
          </button>
        </header>

        <main className="throne-content">
          <div className="throne-menu">
            <button onClick={() => navigate('/')} className="throne-btn">
              <span className="btn-icon">⚔️</span>
              <span className="btn-text">Manage Users</span>
            </button>
            <button onClick={() => navigate('/login')} className="throne-btn">
              <span className="btn-icon">🛡️</span>
              <span className="btn-text">Return to Gates</span>
            </button>
          </div>
        </main>

        <footer className="throne-footer">
          <p>May your reign be prosperous</p>
        </footer>
      </div>
    </div>
  );
}
