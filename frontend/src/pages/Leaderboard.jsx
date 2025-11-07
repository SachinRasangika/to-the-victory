import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCw, AlertCircle, Coins } from 'lucide-react';
import '../styles/leaderboard.css';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchLeaderboard();

    const intervalId = setInterval(() => {
      fetchLeaderboard();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/game/leaderboard');
      const data = await response.json();

      if (response.ok && data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setError('');
        setLastUpdated(new Date());
      } else {
        setError(data.error || 'Failed to fetch leaderboard');
        if (leaderboard.length === 0) {
          setLeaderboard([]);
        }
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      if (leaderboard.length === 0) {
        setError('Unable to connect to leaderboard service');
        setLeaderboard([]);
      }
    } finally {
      if (leaderboard.length === 0) {
        setLoading(false);
      }
    }
  };

  const getMedalIcon = (rank) => {
    switch(rank) {
      case 1: return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFD700' }}>①</span>;
      case 2: return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#C0C0C0' }}>②</span>;
      case 3: return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#CD7F32' }}>③</span>;
      default: return `#${rank}`;
    }
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-bg-overlay"></div>
      
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <button className="leaderboard-back-btn" onClick={() => navigate('/menu')}>
            <ArrowLeft size={24} color="#FBBF24" strokeWidth={2} />
            Back
          </button>
          <h1 className="leaderboard-title">Leaderboard</h1>
          <button className="leaderboard-refresh-btn" onClick={fetchLeaderboard}>
            <RotateCw size={20} color="#FBBF24" strokeWidth={2} />
          </button>
        </div>

        <div className="leaderboard-card">
          {loading ? (
            <div className="leaderboard-loading">
              <div className="spinner"></div>
              <p>Loading leaderboard...</p>
            </div>
          ) : error || !leaderboard.length ? (
            <div className="leaderboard-error">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} color="#FBBF24" strokeWidth={2} />
                <p>{error || 'No leaderboard data available'}</p>
              </div>
              <button className="leaderboard-retry-btn" onClick={fetchLeaderboard}>Retry</button>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((player) => {
                const isCurrentUser = currentUser && player.name === currentUser.name;
                return (
                  <div
                    key={player.rank}
                    className={`leaderboard-item ${player.rank <= 3 ? 'top-rank' : ''} ${isCurrentUser ? 'current-user' : ''}`}
                  >
                    <div className="rank-badge">
                      {getMedalIcon(player.rank)}
                    </div>
                    <div className="player-info">
                      <div className="player-name">
                        {player.name}
                        {isCurrentUser && <span className="current-user-badge">You</span>}
                      </div>
                      <div className="player-stats">
                        Level {player.level} • {player.wins} Wins
                      </div>
                    </div>
                    <div className="player-coins">
                      <Coins size={16} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '4px' }} />
                      {player.coins.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="leaderboard-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCw size={16} color="#FBBF24" strokeWidth={1.5} />
            <p>Leaderboard updates in real-time. Rankings are based on coins earned.</p>
          </div>
          {lastUpdated && (
            <p style={{ fontSize: '12px', color: 'rgba(253, 230, 138, 0.5)', marginTop: '0.5rem' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
