import { useNavigate } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/journey-screen.css';

export default function JourneyScreen({
  sceneNumber = 1,
  totalScenes = 4,
  sceneTitle = '',
  illustrationUrl = '',
  characterName = '',
  dialogue = '',
  narrativeText = '',
  onNext,
  onPrevious,
  disablePrevious = false,
  disableNext = false,
  customContent = null,
  hideIllustration = false,
  hideDialogue = false,
}) {
  const navigate = useNavigate();

  const handleMainMenu = () => {
    navigate('/menu');
  };

  const handleNext = () => {
    if (onNext && !disableNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious && !disablePrevious) {
      onPrevious();
    }
  };

  const progressBars = Array.from({ length: totalScenes }, (_, index) => ({
    active: index < sceneNumber,
    index,
  }));

  return (
    <div className="journey-screen">
      <div className="journey-bg-gradient journey-bg-gradient-left"></div>
      <div className="journey-bg-gradient journey-bg-gradient-right"></div>
      <div className="journey-overlay"></div>
      <div className="journey-overlay-dark"></div>

      <div className="journey-background">
        <img
          src={illustrationUrl || '/images/placeholder-bg.png'}
          alt="Journey background"
          className="journey-bg-image"
        />
        <div className="journey-gradient-top"></div>
        <div className="journey-gradient-bottom"></div>
      </div>

      <div className="journey-content">
        <div className="journey-header">
          <div className="journey-header-left">
            <div className="scene-indicator">
              <span className="scene-number">Scene {sceneNumber} of {totalScenes}</span>
            </div>
            <div className="scene-title-container">
              <h1 className="scene-title">{sceneTitle}</h1>
              <div className="title-divider"></div>
            </div>
          </div>

          <button className="main-menu-btn" onClick={handleMainMenu}>
            <Home size={16} color="#FBBF24" strokeWidth={2} />
            <span>Main Menu</span>
          </button>
        </div>

        <div className="progress-bars">
          {progressBars.map((bar) => (
            <div
              key={bar.index}
              className={`progress-bar ${bar.active ? 'active' : ''}`}
            ></div>
          ))}
        </div>

        <div className="journey-main">
          {customContent ? (
            <>
              {customContent}
              <div className="dialogue-section">
                <div className="navigation-controls">
                  <button
                    className="nav-btn prev-btn"
                    onClick={handlePrevious}
                    disabled={disablePrevious}
                  >
                    <ChevronLeft size={20} color={disablePrevious ? '#57534E' : '#FBBF24'} strokeWidth={2} />
                    <span>Previous</span>
                  </button>

                  <div className="scene-indicator-center">
                    <span>Scene {sceneNumber} of {totalScenes}</span>
                  </div>

                  <button
                    className="nav-btn next-btn"
                    onClick={handleNext}
                    disabled={disableNext}
                  >
                    <span>Next</span>
                    <ChevronRight size={20} color="#FFF" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {!hideIllustration && (
                <div className="illustration-container">
                  <img
                    src={illustrationUrl || '/images/placeholder.png'}
                    alt={sceneTitle}
                    className="scene-illustration"
                  />
                </div>
              )}

              {!hideDialogue && (
                <div className="dialogue-section">
                  {characterName && (
                    <div className="character-tab">
                      <span>{characterName}</span>
                    </div>
                  )}

                  <div className="dialogue-box">
                    <p className="dialogue-text">{dialogue}</p>
                    {narrativeText && (
                      <p className="narrative-text">{narrativeText}</p>
                    )}
                  </div>

                  <div className="navigation-controls">
                    <button
                      className="nav-btn prev-btn"
                      onClick={handlePrevious}
                      disabled={disablePrevious}
                    >
                      <ChevronLeft size={20} color={disablePrevious ? '#57534E' : '#FBBF24'} strokeWidth={2} />
                      <span>Previous</span>
                    </button>

                    <div className="scene-indicator-center">
                      <span>Scene {sceneNumber} of {totalScenes}</span>
                    </div>

                    <button
                      className="nav-btn next-btn"
                      onClick={handleNext}
                      disabled={disableNext}
                    >
                      <span>Next</span>
                      <ChevronRight size={20} color="#FFF" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
