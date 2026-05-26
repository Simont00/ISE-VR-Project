import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getSessions } from '../services/api'

const EMOTION_COLORS = { Happy: '#2EC4B6', Neutral: '#FF9F1C', Stressed: '#E84855' }

// Fallback data if API not ready
const DEMO_SESSIONS = [
  { id: 1, scenario: 'Interview Simulation', date: 'May 15, 2024', duration: '6h 45m', score: 82 },
  { id: 2, scenario: 'Public Speaking',      date: 'May 14, 2024', duration: '8h 30m', score: 74 },
  { id: 3, scenario: 'Team Collaboration',   date: 'May 12, 2024', duration: '6h 0m',  score: 80 },
]
const DEMO_EMOTIONS = [
  { name: 'Happy',   value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Stressed',value: 15 },
]
const DEMO_STATS = {
  totalSessions: 12,
  totalTime: '8h 45m',
  avgPerformance: 78,
  currentStreak: 5,
}

export default function Dashboard() {
  const { user }           = useAuth()
  const navigate           = useNavigate()
  const [sessions, setSessions] = useState(DEMO_SESSIONS)
  const [stats, setStats]       = useState(DEMO_STATS)
  const [emotions, setEmotions] = useState(DEMO_EMOTIONS)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getSessions()
      .then(res => {
        const data = res.data
        if (data.sessions) setSessions(data.sessions.slice(0, 3))
        if (data.stats)    setStats(data.stats)
        if (data.emotions) setEmotions(data.emotions)
      })
      .catch(() => {/* use demo data */})
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: '#0D0B1E' }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: '#E8E6F0' }}>
              Welcome, {firstName}!
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8B87A8' }}>
              Track your progress and improve every day.
            </p>
          </div>
          <button
            onClick={() => navigate('/sessions')}
            className="vr-btn px-5"
            style={{ width: 'auto' }}
          >
            + Start VR Session
          </button>
        </div>

        {/* ── Stat Cards Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon="🎮" label="Total Sessions" value={stats.totalSessions} color="#7B5EA7" />
          <StatCard icon="⏱️" label="Total Time"     value={stats.totalTime}     color="#5B4FCF" />
          <StatCard icon="📈" label="Avg Performance" value={`${stats.avgPerformance}%`} color="#2EC4B6" />
          <StatCard icon="🔥" label="Current Streak"  value={`${stats.currentStreak} Days`} color="#FF9F1C" />
        </div>

        {/* ── Bottom Row: Sessions + Emotion Overview ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Recent Sessions (2/3 width) */}
          <div className="md:col-span-2 vr-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-base" style={{ color: '#E8E6F0' }}>
                Recent Sessions
              </h2>
              <button className="text-xs hover:underline" style={{ color: '#9B72CF' }}
                      onClick={() => navigate('/sessions')}>
                View All →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {sessions.map(s => (
                <div key={s.id} className="session-row flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                         style={{ background: 'rgba(123,94,167,0.2)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B72CF" strokeWidth="1.8">
                        <path d="M2 9C2 7.9 2.9 7 4 7H20C21.1 7 22 7.9 22 9V17C22 18.1 21.1 19 20 19H4C2.9 19 2 18.1 2 17V9Z"/>
                        <circle cx="8.5" cy="13" r="2"/><circle cx="15.5" cy="13" r="2"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#E8E6F0' }}>{s.scenario}</p>
                      <p className="text-xs" style={{ color: '#8B87A8' }}>{s.date} · {s.duration}</p>
                    </div>
                  </div>
                  <ScoreBadge score={s.score} />
                </div>
              ))}
            </div>
          </div>

          {/* Emotion Overview (1/3 width) */}
          <div className="vr-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-base" style={{ color: '#E8E6F0' }}>
                Emotion Overview
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(123,94,167,0.2)', color: '#9B72CF' }}>
                This Week
              </span>
            </div>

            {/* Donut chart */}
            <div className="flex-1 flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={emotions} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                       dataKey="value" strokeWidth={0}>
                    {emotions.map((e, i) => (
                      <Cell key={i} fill={EMOTION_COLORS[e.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`}
                           contentStyle={{ background: '#181535', border: '1px solid #2A2456',
                                           borderRadius: 8, color: '#E8E6F0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2">
              {emotions.map(e => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full"
                         style={{ background: EMOTION_COLORS[e.name] }} />
                    <span className="text-xs" style={{ color: '#8B87A8' }}>{e.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#E8E6F0' }}>
                    {e.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──

function StatCard({ icon, label, value, color }) {
  return (
    <div className="vr-card p-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-lg"
           style={{ background: `${color}22` }}>
        {icon}
      </div>
      <p className="text-xs mb-1" style={{ color: '#8B87A8' }}>{label}</p>
      <p className="font-display font-bold text-xl" style={{ color: '#E8E6F0' }}>{value}</p>
    </div>
  )
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? '#2EC4B6' : score >= 60 ? '#FF9F1C' : '#E84855'
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
         style={{ background: `${color}22`, border: `2px solid ${color}55` }}>
      <span className="text-xs font-bold font-mono" style={{ color }}>{score}</span>
    </div>
  )
}
