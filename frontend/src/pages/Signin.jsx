import React, { useState } from 'react'
import { api, setToken } from '../services/api.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Signin() {
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setErr(''); setMsg('')
    setLoading(true)
    try {
      const data = await api('/api/auth/login', { method: 'POST', body: { email: form.email.trim(), password: form.password } })
      setToken(data.token)
      setMsg('Signed in! Redirecting...')
      setTimeout(() => nav('/profile'), 500)
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h2 className="form-title">Welcome back</h2>
      <div className="form-row">
        <label className="label">Email</label>
        <input className="input" type="email" value={form.email} onChange={e=>setForm(v=>({...v, email:e.target.value}))} required />
      </div>
      <div className="form-row">
        <label className="label">Password</label>
        <input className="input" type="password" value={form.password} onChange={e=>setForm(v=>({...v, password:e.target.value}))} required />
      </div>
      {msg && <div className="notice">{msg}</div>}
      {err && <div className="error">{err}</div>}
      <div className="actions">
        <button className="button-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        <Link className="button-link" to="/signup">Create account</Link>
      </div>
    </form>
  )
}
