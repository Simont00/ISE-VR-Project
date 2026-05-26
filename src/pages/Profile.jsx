import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ACHIEVEMENTS = [
  { id: 1, emoji: '🥇', label: 'First Session',    earned: true,  desc: 'Completed your first VR session' },
  { id: 2, emoji: '🏅', label: '5 Sessions',        earned: true,  desc: 'Completed 5 VR sessions' },
  { id: 3, emoji: '🏆', label: 'Great Performer',   earned: true,  desc: 'Scored 80%+ three times' },
  { id: 4, emoji: '🔥', label: '7-Day Streak',      earned: false, desc: 'Practice 7 days in a row' },
  { id: 5, emoji: '⭐', label: 'Top 10%',           earned: false, desc: 'Reach top 10% of performers' },
  { id: 6, emoji: '🎓', label: 'Master Speaker',    earned: false, desc: 'Complete 10 speaking sessions' },
]

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing]   = useState(false)
  const [form, setForm]         = useState({ name: user?.name || '', email: user?.email || '' })
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      await updateProfile(form)
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  const initials = (user?.name || 'User').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'March 2024'

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: '#0D0B1E' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl" style={{ color: '#E8E6F0' }}>Profile</h1>
          <p className="text-sm mt-1" style={{ color: '#8B87A8' }}>Manage your account and view achievements</p>
        </div>

        {/* Success toast */}
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
               style={{ background: 'rgba(46,196,182,0.1)', border: '1px solid rgba(46,196,182,0.3)',
                        color: '#2EC4B6' }}>
            ✅ Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ── Avatar + basic info ── */}
          <div className="vr-card p-6 flex flex-col items-center text-center">
            {/* Avatar circle */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 relative"
                 style={{ background: 'linear-gradient(135deg, #7B5EA7, #5B4FCF)',
                          boxShadow: '0 8px 24px rgba(123,94,167,0.4)', color: 'white' }}>
              {initials}
              {/* Online dot */}
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2"
                   style={{ background: '#2EC4B6', borderColor: '#0D0B1E' }} />
            </div>

            <h2 className="font-display font-bold text-lg" style={{ color: '#E8E6F0' }}>
              {user?.name || 'User'}
            </h2>
            <p className="text-sm mt-1" style={{ color: '#8B87A8' }}>{user?.email}</p>
            <p className="text-xs mt-1" style={{ color: '#5B5780' }}>Member since {memberSince}</p>

            {/* Stats */}
            <div className="flex gap-4 mt-5 w-full">
              <div className="flex-1 p-3 rounded-xl" style={{ background: 'rgba(123,94,167,0.1)', border: '1px solid #2A2456' }}>
                <p className="font-bold text-lg font-mono" style={{ color: '#E8E6F0' }}>12</p>
                <p className="text-xs" style={{ color: '#8B87A8' }}>Sessions</p>
              </div>
              <div className="flex-1 p-3 rounded-xl" style={{ background: 'rgba(123,94,167,0.1)', border: '1px solid #2A2456' }}>
                <p className="font-bold text-lg font-mono" style={{ color: '#E8E6F0' }}>78%</p>
                <p className="text-xs" style={{ color: '#8B87A8' }}>Avg Score</p>
              </div>
            </div>

            {!editing && (
              <button onClick={() => setEditing(true)}
                      className="mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: 'rgba(123,94,167,0.15)', color: '#9B72CF',
                               border: '1px solid rgba(123,94,167,0.3)' }}>
                Edit Profile
              </button>
            )}
          </div>

          {/* ── Account Info / Edit form ── */}
          <div className="md:col-span-2 flex flex-col gap-4">

            <div className="vr-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-base" style={{ color: '#E8E6F0' }}>
                  Account Info
                </h2>
                {editing && (
                  <button onClick={() => { setEditing(false); setError('') }}
                          className="text-xs" style={{ color: '#8B87A8' }}>
                    Cancel
                  </button>
                )}
              </div>

              {editing ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B87A8' }}>
                      Full Name
                    </label>
                    <input name="name" value={form.name} onChange={handle}
                           className="vr-input" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B87A8' }}>
                      Email Address
                    </label>
                    <input name="email" value={form.email} onChange={handle} type="email"
                           className="vr-input" placeholder="your@email.com" />
                  </div>
                  {error && (
                    <p className="text-xs" style={{ color: '#E84855' }}>{error}</p>
                  )}
                  <button onClick={save} className="vr-btn" style={{ maxWidth: 160 }} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <InfoRow label="Full Name"    value={user?.name || '—'} />
                  <InfoRow label="Email"        value={user?.email || '—'} />
                  <InfoRow label="Member Since" value={memberSince} />
                  <InfoRow label="Account Type" value="Standard" badge />
                </div>
              )}
            </div>

            {/* Password section */}
            <div className="vr-card p-5">
              <h2 className="font-display font-semibold text-base mb-4" style={{ color: '#E8E6F0' }}>
                Security
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: '#E8E6F0' }}>Password</p>
                  <p className="text-xs" style={{ color: '#8B87A8' }}>Last changed: recently</p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: 'rgba(123,94,167,0.1)', color: '#9B72CF',
                                 border: '1px solid rgba(123,94,167,0.2)' }}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="vr-card p-5 mt-4">
          <h2 className="font-display font-semibold text-base mb-5" style={{ color: '#E8E6F0' }}>
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                   style={{
                     background: a.earned ? 'rgba(123,94,167,0.1)' : 'rgba(255,255,255,0.02)',
                     border: `1px solid ${a.earned ? 'rgba(123,94,167,0.3)' : '#2A2456'}`,
                     opacity: a.earned ? 1 : 0.5,
                   }}>
                <span className="text-2xl">{a.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: a.earned ? '#E8E6F0' : '#8B87A8' }}>
                    {a.label}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#5B5780' }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function InfoRow({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#2A2456' }}>
      <span className="text-sm" style={{ color: '#8B87A8' }}>{label}</span>
      {badge ? (
        <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(123,94,167,0.2)', color: '#9B72CF' }}>
          {value}
        </span>
      ) : (
        <span className="text-sm" style={{ color: '#E8E6F0' }}>{value}</span>
      )}
    </div>
  )
}
