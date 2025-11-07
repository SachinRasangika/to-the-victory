import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Moon, Gauge, Joystick, Lock } from 'lucide-react';
import '../styles/settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedSound = localStorage.getItem('soundEnabled');
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound));
    if (savedTheme !== null) setDarkMode(JSON.parse(savedTheme));
  }, []);

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', JSON.stringify(newValue));
  };

  const handleThemeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
    document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light');
  };

  return (
    <div className="settings-page">
      <div className="settings-bg-overlay"></div>
      
      <div className="settings-container">
        <div className="settings-header">
          <button className="settings-back-btn" onClick={() => navigate('/menu')}>
            <ArrowLeft size={24} color="#FBBF24" strokeWidth={2} />
            Back
          </button>
          <h1 className="settings-title">Settings</h1>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="settings-card">
          <div className="settings-section">
            <h2 className="settings-section-title">Audio</h2>

            <div className="settings-item">
              <div className="settings-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={20} color="#FBBF24" strokeWidth={1.5} />
                  <label className="settings-label">Sound Effects</label>
                </div>
                <p className="settings-description">Enable or disable game sound effects</p>
              </div>
              <div className={`toggle ${soundEnabled ? 'active' : ''}`} onClick={handleSoundToggle}>
                <div className="toggle-indicator"></div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="settings-section-title">Display</h2>

            <div className="settings-item">
              <div className="settings-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Moon size={20} color="#FBBF24" strokeWidth={1.5} />
                  <label className="settings-label">Dark Mode</label>
                </div>
                <p className="settings-description">Switch between light and dark theme</p>
              </div>
              <div className={`toggle ${darkMode ? 'active' : ''}`} onClick={handleThemeToggle}>
                <div className="toggle-indicator"></div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="settings-section-title">Game</h2>

            <div className="settings-item">
              <div className="settings-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gauge size={20} color="#FBBF24" strokeWidth={1.5} />
                  <label className="settings-label">Difficulty</label>
                </div>
                <p className="settings-description">Normal</p>
              </div>
              <span className="settings-badge">Coming Soon</span>
            </div>

            <div className="settings-item">
              <div className="settings-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Joystick size={20} color="#FBBF24" strokeWidth={1.5} />
                  <label className="settings-label">Controls</label>
                </div>
                <p className="settings-description">Customize game controls</p>
              </div>
              <span className="settings-badge">Coming Soon</span>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="settings-section-title">Account</h2>

            <div className="settings-item">
              <div className="settings-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={20} color="#FBBF24" strokeWidth={1.5} />
                  <label className="settings-label">Privacy Settings</label>
                </div>
                <p className="settings-description">Manage your privacy preferences</p>
              </div>
              <span className="settings-badge">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
