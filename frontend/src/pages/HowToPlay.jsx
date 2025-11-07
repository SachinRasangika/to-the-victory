import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Sword, Coins, TrendingUp, Trophy, HelpCircle, Lightbulb, Shield, Zap, BookOpen } from 'lucide-react';
import '../styles/how-to-play.css';

export default function HowToPlay() {
  const navigate = useNavigate();

  return (
    <div className="tutorial-page">
      <div className="tutorial-bg-overlay"></div>
      
      <div className="tutorial-container">
        <div className="tutorial-header">
          <button className="tutorial-back-btn" onClick={() => navigate('/menu')}>
            <ArrowLeft size={24} color="#FBBF24" strokeWidth={2} />
            Back
          </button>
          <h1 className="tutorial-title">How to Play</h1>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="tutorial-card">
          <div className="tutorial-section">
            <h2 className="tutorial-section-title"><Target size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Objective</h2>
            <p className="tutorial-text">
              Welcome to the Path to the Throne! Your goal is to navigate through the ancient kingdom of Sri Lanka, gather coins, level up your character, and defeat powerful enemies to reach the throne and claim your crown.
            </p>
          </div>

          <div className="tutorial-section">
            <h2 className="tutorial-section-title"><Sword size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Combat System</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Attack</h3>
                  <p>Click on enemies to attack them. Your damage depends on your current level.</p>
                </div>
              </div>
              <div className="tutorial-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Defense</h3>
                  <p>Increase your defense by equipping armor and shields found in the kingdom.</p>
                </div>
              </div>
              <div className="tutorial-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Special Skills</h3>
                  <p>Unlock powerful special abilities as you level up your character.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tutorial-section">
            <h2 className="tutorial-section-title"><Coins size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Currency & Resources</h2>
            <div className="resource-list">
              <div className="resource-item">
                <span className="resource-icon"><Coins size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                <div>
                  <strong>Coins</strong> - Main currency earned by defeating enemies and completing quests
                </div>
              </div>
              <div className="resource-item">
                <span className="resource-icon"><Zap size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                <div>
                  <strong>Experience (XP)</strong> - Earned from battles; reach milestones to level up
                </div>
              </div>
              <div className="resource-item">
                <span className="resource-icon"><Shield size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                <div>
                  <strong>Gems</strong> - Rare currency used for premium items and power-ups
                </div>
              </div>
            </div>
          </div>

          <div className="tutorial-section">
            <h2 className="tutorial-section-title"><TrendingUp size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Leveling & Progression</h2>
            <div className="progression-info">
              <p>• Start at Level 1 with basic stats</p>
              <p>• Earn XP from defeating enemies and completing quests</p>
              <p>• Each level increases your: Attack, Defense, and Max Health</p>
              <p>• Unlock new areas and bosses at specific levels</p>
              <p>• Max level cap: 50 (for now!)</p>
            </div>
          </div>

          <div className="tutorial-section">
            <h2 className="tutorial-section-title"><Trophy size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Tips & Tricks</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-emoji"><Lightbulb size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                <p>Grind weak enemies to farm coins before taking on stronger foes</p>
              </div>
              <div className="tip-card">
                <span className="tip-emoji"><Shield size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                <p>Keep your armor upgraded; defense is just as important as attack</p>
              </div>
              <div className="tip-card">
                <span className="tip-emoji"><Zap size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                <p>Use special skills strategically - they have cooldowns</p>
              </div>
              <div className="tip-card">
                <span className="tip-emoji"><Target size={20} color="#FBBF24" strokeWidth={1.5} /></span>
                <p>Check the leaderboard and compete with other players</p>
              </div>
            </div>
          </div>

          <div className="tutorial-section">
            <h2 className="tutorial-section-title"><HelpCircle size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />FAQ</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary>Can I reset my character?</summary>
                <p>Yes, visit the settings and select "Reset Progress" to start fresh.</p>
              </details>
              <details className="faq-item">
                <summary>How often does the leaderboard update?</summary>
                <p>Leaderboards update in real-time as players earn coins.</p>
              </details>
              <details className="faq-item">
                <summary>What happens when I reach level 50?</summary>
                <p>Coming soon! We have exciting endgame content planned.</p>
              </details>
              <details className="faq-item">
                <summary>Can I play offline?</summary>
                <p>No, you need an internet connection to play and save progress.</p>
              </details>
            </div>
          </div>

          <button className="tutorial-ready-btn" onClick={() => navigate('/menu')}>
            <BookOpen size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />
            Ready to Begin!
          </button>
        </div>
      </div>
    </div>
  );
}
