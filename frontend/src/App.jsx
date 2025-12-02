import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ThroneRoom from './pages/ThroneRoom';
import MainMenu from './pages/MainMenu';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import HowToPlay from './pages/HowToPlay';
import Credits from './pages/Credits';
import Game from './pages/Game';
import LevelSelection from './pages/LevelSelection';
import './App.css';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/menu' || location.pathname === '/settings' || location.pathname === '/profile' || location.pathname === '/leaderboard' || location.pathname === '/how-to-play' || location.pathname === '/credits' || location.pathname === '/levels' || location.pathname.startsWith('/game/');

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="navbar-brand">App</h2>
        {user && (
          <div className="navbar-actions">
            <span className="navbar-user">{user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/how-to-play"
          element={
            <ProtectedRoute>
              <HowToPlay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credits"
          element={
            <ProtectedRoute>
              <Credits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels"
          element={
            <ProtectedRoute>
              <LevelSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/:levelId"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route
          path="/throne"
          element={
            <ProtectedRoute>
              <ThroneRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
