import React, { useState } from 'react'
import { api, setToken } from '../services/api.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setErr(''); setMsg('')
    if (form.password !== form.confirm) { setErr('Passwords do not match'); return }
    setLoading(true)
    try {
      const data = await api('/api/auth/register', { method: 'POST', body: { name: form.name.trim(), email: form.email.trim(), password: form.password } })
      setToken(data.token)
      setMsg('Account created! Redirecting...')
      setTimeout(() => nav('/profile'), 700)
    } catch (e) {
      setErr(e.message)
    } finally { setLoading(false) }
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h2 className="form-title">Sign up</h2>
      <div className="form-row">
        <label className="label">Full name</label>
        <input className="input" value={form.name} onChange={e=>setForm(v=>({...v, name:e.target.value}))} required />
      </div>
      <div className="form-row">
        <label className="label">Email</label>
        <input className="input" type="email" value={form.email} onChange={e=>setForm(v=>({...v, email:e.target.value}))} required />
      </div>
      <div className="form-row">
        <label className="label">Password</label>
        <input className="input" type="password" minLength={6} value={form.password} onChange={e=>setForm(v=>({...v, password:e.target.value}))} required />
      </div>
      <div className="form-row">
        <label className="label">Confirm password</label>
        <input className="input" type="password" minLength={6} value={form.confirm} onChange={e=>setForm(v=>({...v, confirm:e.target.value}))} required />
      </div>
      {msg && <div className="notice">{msg}</div>}
      {err && <div className="error">{err}</div>}
      <div className="actions">
        <button className="button-primary" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        <Link className="button-link" to="/signin">Have an account? Sign in</Link>
      </div>
      <p className="helper">By continuing, you agree to the terms and privacy policy.</p>
    </form>
  )
}
