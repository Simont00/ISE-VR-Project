import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api' // 👈 Direct register target route wrapper

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      // 🚀 Submitting payload architecture directly to backend /api/register
      const response = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      })

      if (response.data?.token) {
        localStorage.setItem('ise_token', response.data.token)
        localStorage.setItem('user_name', response.data.user?.name || '')
        navigate('/dashboard')
      } else {
        setError('Account created, please proceed to manually login.')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute rounded-full opacity-20 blur-3xl"
             style={{ width: 400, height: 400, top: '10%', right: '-5%',
                      background: 'radial-gradient(circle, #7B5EA7, transparent)' }} />
        <div className="absolute rounded-full opacity-15 blur-3xl"
             style={{ width: 300, height: 300, bottom: '5%', left: '-5%',
                      background: 'radial-gradient(circle, #5B4FCF, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="vr-card p-8 shadow-card">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                 style={{ background: 'linear-gradient(135deg, #7B5EA7, #5B4FCF)',
                          boxShadow: '0 8px 24px rgba(123,94,167,0.4)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V9Z" stroke="white" strokeWidth="1.5"/>
                <circle cx="8.5" cy="13" r="2.5" stroke="white" strokeWidth="1.5"/>
                <circle cx="15.5" cy="13" r="2.5" stroke="white" strokeWidth="1.5"/>
                <path d="M11 13H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="font-display font-bold text-xl" style={{ color: '#E8E6F0' }}>ISE VR</h1>
          </div>

          <h2 className="font-display font-semibold text-lg text-center mb-1" style={{ color: '#E8E6F0' }}>
            Create Account
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: '#8B87A8' }}>
            Start your immersive skills journey
          </p>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B87A8' }}>Full Name</label>
              <input type="text" name="name" placeholder="Alex Johnson"
                     value={form.name} onChange={handle} className="vr-input" autoComplete="name" />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B87A8' }}>Email</label>
              <input type="email" name="email" placeholder="example@email.com"
                     value={form.email} onChange={handle} className="vr-input" autoComplete="email" />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B87A8' }}>Password</label>
              <input type="password" name="password" placeholder="Min 6 characters"
                     value={form.password} onChange={handle} className="vr-input" autoComplete="new-password" />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B87A8' }}>Confirm Password</label>
              <input type="password" name="confirm" placeholder="Repeat password"
                     value={form.confirm} onChange={handle} className="vr-input" autoComplete="new-password" />
            </div>

            {form.password && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all"
                         style={{
                           background: i < strengthLevel(form.password) ? strengthColor(form.password) : '#2A2456'
                         }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: '#8B87A8' }}>
                  Strength: {strengthLabel(form.password)}
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                   style={{ background: 'rgba(232,72,85,0.1)', border: '1px solid rgba(232,72,85,0.3)', color: '#F08090' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="vr-btn mt-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: '#8B87A8' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#9B72CF' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function strengthLevel(pw) {
  let s = 0
  if (pw.length >= 6)  s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
function strengthColor(pw) {
  const l = strengthLevel(pw)
  return ['#E84855','#FF9F1C','#7B5EA7','#2EC4B6'][l - 1] || '#E84855'
}
function strengthLabel(pw) {
  return ['Weak','Fair','Good','Strong'][strengthLevel(pw) - 1] || 'Weak'
}