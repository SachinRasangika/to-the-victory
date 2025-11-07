import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Zap, Coins, Gamepad2, Trophy, TrendingUp, Sparkles, Lock } from 'lucide-react';
import '../styles/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    level: 1,
    experience: 0,
    coins: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    joinDate: new Date().toLocaleDateString()
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="profile-page">
      <div className="profile-bg-overlay"></div>
      
      <div className="profile-container">
        <div className="profile-header">
          <button className="profile-back-btn" onClick={() => navigate('/menu')}>
            <ArrowLeft size={24} color="#FBBF24" strokeWidth={2} />
            Back
          </button>
          <h1 className="profile-title">Profile</h1>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="profile-card">
          {user && (
            <>
              <div className="profile-info">
                <div className="profile-avatar">
                  <Crown size={32} color="#FBBF24" strokeWidth={1.5} />
                </div>
                <div className="profile-user-info">
                  <h2 className="profile-name">{user.name}</h2>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-join-date">Member since {stats.joinDate}</p>
                </div>
              </div>

              <div className="profile-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon"><Zap size={20} color="#FBBF24" strokeWidth={1.5} /></div>
                  <div className="stat-content">
                    <div className="stat-label">Level</div>
                    <div className="stat-value">{stats.level}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon"><Coins size={20} color="#FBBF24" strokeWidth={1.5} /></div>
                  <div className="stat-content">
                    <div className="stat-label">Coins</div>
                    <div className="stat-value">{stats.coins.toLocaleString()}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon"><Gamepad2 size={20} color="#FBBF24" strokeWidth={1.5} /></div>
                  <div className="stat-content">
                    <div className="stat-label">Games Played</div>
                    <div className="stat-value">{stats.gamesPlayed}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon"><Trophy size={20} color="#FBBF24" strokeWidth={1.5} /></div>
                  <div className="stat-content">
                    <div className="stat-label">Games Won</div>
                    <div className="stat-value">{stats.gamesWon}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon"><TrendingUp size={20} color="#FBBF24" strokeWidth={1.5} /></div>
                  <div className="stat-content">
                    <div className="stat-label">Win Rate</div>
                    <div className="stat-value">{winRate}%</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon"><Sparkles size={20} color="#FBBF24" strokeWidth={1.5} /></div>
                  <div className="stat-content">
                    <div className="stat-label">Experience</div>
                    <div className="stat-value">{stats.experience}</div>
                  </div>
                </div>
              </div>

              <div className="profile-progress">
                <div className="progress-label">
                  <span>Level Progress</span>
                  <span className="progress-percent">45%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="profile-achievements">
                <h3 className="achievements-title">Recent Achievements</h3>
                <div className="achievements-grid">
                  <div className="achievement-badge">
                    <span className="achievement-icon"><Sparkles size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                    <span className="achievement-name">First Victory</span>
                  </div>
                  <div className="achievement-badge">
                    <span className="achievement-icon"><Zap size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                    <span className="achievement-name">Speed Runner</span>
                  </div>
                  <div className="achievement-badge locked">
                    <span className="achievement-icon"><Lock size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                    <span className="achievement-name">Locked</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
