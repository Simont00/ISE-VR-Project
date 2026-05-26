import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4">

      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute rounded-full opacity-20 blur-3xl"
             style={{ width: 400, height: 400, top: '10%', left: '-5%',
                      background: 'radial-gradient(circle, #7B5EA7, transparent)' }} />
        <div className="absolute rounded-full opacity-15 blur-3xl"
             style={{ width: 350, height: 350, bottom: '5%', right: '-5%',
                      background: 'radial-gradient(circle, #5B4FCF, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md">

        {/* ── Card ── */}
        <div className="vr-card p-8 shadow-card">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                 style={{ background: 'linear-gradient(135deg, #7B5EA7, #5B4FCF)',
                          boxShadow: '0 8px 24px rgba(123,94,167,0.4)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V9Z" stroke="white" strokeWidth="1.5"/>
                <circle cx="8.5" cy="13" r="2.5" stroke="white" strokeWidth="1.5"/>
                <circle cx="15.5" cy="13" r="2.5" stroke="white" strokeWidth="1.5"/>
                <path d="M11 13H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="font-display font-bold text-2xl glow-text" style={{ color: '#E8E6F0' }}>
              ISE VR
            </h1>
            <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: '#8B87A8' }}>
              Interactive Skills Enhancer
            </p>
          </div>

          <h2 className="font-display font-semibold text-lg text-center mb-1" style={{ color: '#E8E6F0' }}>
            Welcome Back!
          </h2>
          <p className="text-center text-sm mb-7" style={{ color: '#8B87A8' }}>
            Login to continue your journey
          </p>

          {/* ── Form ── */}
          <form onSubmit={submit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B87A8' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handle}
                className="vr-input"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium" style={{ color: '#8B87A8' }}>Password</label>
                <a href="#" className="text-xs hover:underline" style={{ color: '#9B72CF' }}>
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                className="vr-input"
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                   style={{ background: 'rgba(232,72,85,0.1)', border: '1px solid rgba(232,72,85,0.3)',
                            color: '#F08090' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="vr-btn mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Logging in…
                </span>
              ) : 'Login'}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm mt-5" style={{ color: '#8B87A8' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#9B72CF' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
