import React, { useEffect, useState } from 'react'
import { api, getToken, clearToken } from '../services/api.js'
import { useNavigate, Link } from 'react-router-dom'

export default function Profile() {
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) { setErr('Not signed in'); return }
    api('/api/auth/me', { token })
      .then(d => setUser(d.user))
      .catch(e => setErr(e.message))
  }, [])

  function logout() {
    clearToken(); nav('/signin')
  }

  return (
    <div className="form-card">
      {err && <div className="error">{err}</div>}
      {user && (
        <div className="profile-box">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      )}
      <div className="actions">
        <button className="button-primary" onClick={logout}>Log out</button>
        <Link className="button-link" to="/">Back</Link>
      </div>
    </div>
  )
}
