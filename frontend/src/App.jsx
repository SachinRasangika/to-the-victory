import React from 'react'
import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Signin from './pages/Signin.jsx'
import Profile from './pages/Profile.jsx'

function Nav() {
  return (
    <header className="site-header">
      <h1 className="site-title">Welcome</h1>
      <nav className="nav-row">
        <Link className="button-link" to="/signup">Sign up</Link>
        <Link className="button-link" to="/signin">Sign in</Link>
        <Link className="button-link" to="/profile">Profile</Link>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <div className="page-shell">
      <Nav />
      <main className="content-area">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
