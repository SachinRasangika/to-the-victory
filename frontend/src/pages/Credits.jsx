import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Palette, Volume2, Settings, Smartphone, TestTube, Scroll } from 'lucide-react';
import '../styles/credits.css';

export default function Credits() {
  const navigate = useNavigate();

  return (
    <div className="credits-page">
      <div className="credits-bg-overlay"></div>
      
      <div className="credits-container">
        <div className="credits-header">
          <button className="credits-back-btn" onClick={() => navigate('/menu')}>
            <ArrowLeft size={24} color="#FBBF24" strokeWidth={2} />
            Back
          </button>
          <h1 className="credits-title">Credits & About</h1>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="credits-card">
          <div className="credits-section">
            <h2 className="credits-section-title">About Path to the Throne</h2>
            <p className="credits-text">
              Path to the Throne is an immersive fantasy RPG set in the Chronicles of Sri Lanka. 
              Experience the glory of ancient kingdoms, master combat skills, and claim your rightful place 
              on the throne. Build your legacy, compete on global leaderboards, and become a legend.
            </p>
          </div>

          <div className="credits-section">
            <h2 className="credits-section-title">Game Version</h2>
            <p className="credits-text">Version 1.0.0 • Alpha Release</p>
          </div>

          <div className="credits-section">
            <h2 className="credits-section-title">Development Team</h2>
            <div className="credits-list">
              <div className="credit-item">
                <span className="credit-role"><Code size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Game Design</span>
                <span className="credit-name">The Chronicles Collective</span>
              </div>
              <div className="credit-item">
                <span className="credit-role"><Palette size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Art & UI</span>
                <span className="credit-name">Design Team</span>
              </div>
              <div className="credit-item">
                <span className="credit-role"><Volume2 size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Audio</span>
                <span className="credit-name">Sound Engineers</span>
              </div>
              <div className="credit-item">
                <span className="credit-role"><Settings size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Backend</span>
                <span className="credit-name">Server Team</span>
              </div>
              <div className="credit-item">
                <span className="credit-role"><Smartphone size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />Frontend</span>
                <span className="credit-name">Web Development Team</span>
              </div>
              <div className="credit-item">
                <span className="credit-role"><TestTube size={20} color="#FBBF24" strokeWidth={1.5} style={{ display: 'inline-block', marginRight: '8px' }} />QA Testing</span>
                <span className="credit-name">Quality Assurance Team</span>
              </div>
            </div>
          </div>

          <div className="credits-section">
            <h2 className="credits-section-title">Special Thanks</h2>
            <p className="credits-text">
              We would like to extend our heartfelt gratitude to:
            </p>
            <div className="thanks-list">
              <p>• Our amazing community of beta testers</p>
              <p>• All players who contributed feedback and suggestions</p>
              <p>• The open-source libraries and frameworks we used</p>
              <p>• Sri Lankan cultural historians and advisors</p>
            </div>
          </div>

          <div className="credits-section">
            <h2 className="credits-section-title">Technology Stack</h2>
            <div className="tech-stack">
              <div className="tech-item">
                <strong>Frontend:</strong> React, Vite, CSS3
              </div>
              <div className="tech-item">
                <strong>Backend:</strong> Node.js, Express, MongoDB
              </div>
              <div className="tech-item">
                <strong>Authentication:</strong> JWT
              </div>
              <div className="tech-item">
                <strong>Hosting:</strong> Cloud Services
              </div>
            </div>
          </div>

          <div className="credits-section">
            <h2 className="credits-section-title">Legal</h2>
            <div className="legal-links">
              <a href="#" className="legal-link">Privacy Policy</a>
              <a href="#" className="legal-link">Terms of Service</a>
              <a href="#" className="legal-link">Contact Us</a>
            </div>
          </div>

          <div className="credits-footer">
            <p className="credits-tagline">
              "May your reign be prosperous and your legacy eternal"
            </p>
            <p className="credits-copyright">
              © 2024 Path to the Throne. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
