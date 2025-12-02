import { useNavigate } from 'react-router-dom';
import { Crown, Play, User, Trophy, HelpCircle, Settings, Scroll, LogOut } from 'lucide-react';
import '../styles/main-menu.css';

export default function MainMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleStartGame = () => {
    navigate('/levels');
  };

  return (
    <div className="menu-page">
      <div className="menu-bg-overlay"></div>

      <div className="menu-container">
        <div className="menu-crown-container">
          <Crown size={64} color="#FBBF24" strokeWidth={1.5} />
        </div>

        <div className="menu-header">
          <h1 className="menu-title">PATH TO THE THRONE</h1>
          <p className="menu-subtitle">Chronicles of Sri Lanka</p>
          <p className="menu-description">
            Step into a realm of ancient glory, where kings ruled with wisdom and warriors fought with
          </p>
        </div>

        <div className="menu-actions">
          <button className="menu-btn" onClick={handleStartGame}>
            <div className="menu-btn-indicator"></div>
            <div className="menu-btn-content">
              <Play size={24} color="#FEF3C7" strokeWidth={1.5} />
              <span className="menu-btn-text">Begin Journey</span>
            </div>
            <div className="menu-btn-indicator"></div>
          </button>

          <button className="menu-btn" onClick={() => navigate('/profile')}>
            <div className="menu-btn-indicator"></div>
            <div className="menu-btn-content">
              <User size={24} color="#FBBF24" strokeWidth={1.5} />
              <span className="menu-btn-text">Profile</span>
            </div>
            <div className="menu-btn-indicator"></div>
          </button>

          <button className="menu-btn" onClick={() => navigate('/leaderboard')}>
            <div className="menu-btn-indicator"></div>
            <div className="menu-btn-content">
              <Trophy size={24} color="#FBBF24" strokeWidth={1.5} />
              <span className="menu-btn-text">Leaderboard</span>
            </div>
            <div className="menu-btn-indicator"></div>
          </button>

          <button className="menu-btn" onClick={() => navigate('/how-to-play')}>
            <div className="menu-btn-indicator"></div>
            <div className="menu-btn-content">
              <HelpCircle size={24} color="#FBBF24" strokeWidth={1.5} />
              <span className="menu-btn-text">How to Play</span>
            </div>
            <div className="menu-btn-indicator"></div>
          </button>

          <button className="menu-btn" onClick={() => navigate('/settings')}>
            <div className="menu-btn-indicator"></div>
            <div className="menu-btn-content">
              <Settings size={24} color="#FBBF24" strokeWidth={1.5} />
              <span className="menu-btn-text">Settings</span>
            </div>
            <div className="menu-btn-indicator"></div>
          </button>

          <button className="menu-btn" onClick={() => navigate('/credits')}>
            <div className="menu-btn-indicator"></div>
            <div className="menu-btn-content">
              <Scroll size={24} color="#FBBF24" strokeWidth={1.5} />
              <span className="menu-btn-text">Credits</span>
            </div>
            <div className="menu-btn-indicator"></div>
          </button>

          <button className="menu-btn menu-btn-logout" onClick={handleLogout}>
            <div className="menu-btn-indicator"></div>
            <div className="menu-btn-content">
              <LogOut size={24} color="#FCA5A5" strokeWidth={1.5} />
              <span className="menu-btn-text">Leave Kingdom</span>
            </div>
            <div className="menu-btn-indicator"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
