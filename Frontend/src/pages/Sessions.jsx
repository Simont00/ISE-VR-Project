import { useState, useEffect, useRef } from 'react'
import { getSessions, startSession, endSession } from '../services/api'

const SCENARIOS = [
  { id: 'interview',  name: 'Interview Simulation',  icon: '💼', desc: 'Practice job interviews with AI interviewer' },
  { id: 'speaking',   name: 'Public Speaking',        icon: '🎤', desc: 'Speak confidently to virtual audiences' },
  { id: 'teamwork',   name: 'Team Collaboration',     icon: '🤝', desc: 'Navigate team dynamics and conflict' },
  { id: 'negotiation',name: 'Negotiation',             icon: '🤜', desc: 'Master persuasion and deal-making' },
]

// Demo session history
const DEMO = [
  { id: 1, scenario: 'Interview Simulation', date: 'May 15, 2024', duration: '6h 45m', score: 82, emotions: { Happy: 65, Neutral: 20, Stressed: 15 } },
  { id: 2, scenario: 'Public Speaking',      date: 'May 14, 2024', duration: '8h 30m', score: 74, emotions: { Happy: 50, Neutral: 30, Stressed: 20 } },
  { id: 3, scenario: 'Team Collaboration',   date: 'May 12, 2024', duration: '6h 0m',  score: 80, emotions: { Happy: 70, Neutral: 25, Stressed: 5  } },
]

export default function Sessions() {
  const [sessions, setSessions]   = useState(DEMO)
  const [active, setActive]       = useState(null)     // active session object
  const [phase, setPhase]         = useState('list')   // 'list' | 'pick' | 'running'
  const [scenario, setScenario]   = useState(null)
  const [emotion, setEmotion]     = useState('Happy')
  const [elapsed, setElapsed]     = useState(0)
  const [confidence, setConfidence] = useState(75)
  const timerRef = useRef(null)

  // ── Fetch real sessions ──
  useEffect(() => {
    getSessions().then(r => { if (r.data.sessions) setSessions(r.data.sessions) }).catch(() => {})
  }, [])

  // ── Timer while session running ──
  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  async function handleStart() {
    if (!scenario) return
    try {
      const res = await startSession({ scenario: scenario.name })
      setActive(res.data.session)
    } catch {
      setActive({ id: Date.now(), scenario: scenario.name })
    }
    setElapsed(0)
    setPhase('running')
  }

  async function handleEnd() {
    if (active) {
      try {
        await endSession(active.id, { duration: elapsed, confidence, emotion })
      } catch {}
    }
    setPhase('list')
    setActive(null)
    setScenario(null)
  }

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // ──────────────────────────────────────────────
  if (phase === 'running') return <RunningSession
    scenario={scenario} elapsed={elapsed} fmt={fmt}
    emotion={emotion} setEmotion={setEmotion}
    confidence={confidence} setConfidence={setConfidence}
    onEnd={handleEnd} />
  // ──────────────────────────────────────────────

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: '#0D0B1E' }}>
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: '#E8E6F0' }}>VR Sessions</h1>
            <p className="text-sm mt-1" style={{ color: '#8B87A8' }}>Choose a scenario and begin your practice</p>
          </div>
          <button className="vr-btn" style={{ width: 'auto', padding: '10px 20px' }}
                  onClick={() => setPhase('pick')}>
            + New Session
          </button>
        </div>

        {/* ── Scenario picker (shown inline when phase=pick) ── */}
        {phase === 'pick' && (
          <div className="vr-card p-5 mb-6">
            <h2 className="font-display font-semibold text-base mb-4" style={{ color: '#E8E6F0' }}>
              Pick a Scenario
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {SCENARIOS.map(sc => (
                <button key={sc.id} onClick={() => setScenario(sc)}
                        className="p-4 rounded-xl text-left transition-all border"
                        style={{
                          background: scenario?.id === sc.id ? 'rgba(123,94,167,0.2)' : 'rgba(255,255,255,0.03)',
                          borderColor: scenario?.id === sc.id ? '#7B5EA7' : '#2A2456',
                        }}>
                  <span className="text-2xl block mb-2">{sc.icon}</span>
                  <p className="text-sm font-semibold" style={{ color: '#E8E6F0' }}>{sc.name}</p>
                  <p className="text-xs mt-1" style={{ color: '#8B87A8' }}>{sc.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="vr-btn" style={{ maxWidth: 180 }} onClick={handleStart} disabled={!scenario}>
                Start Session
              </button>
              <button onClick={() => setPhase('list')} className="px-4 py-2 rounded-xl text-sm"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#8B87A8', border: '1px solid #2A2456' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Session History ── */}
        <div className="vr-card p-5">
          <h2 className="font-display font-semibold text-base mb-4" style={{ color: '#E8E6F0' }}>
            Session History
          </h2>
          <div className="flex flex-col gap-3">
            {sessions.map(s => (
              <div key={s.id} className="session-row flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: 'rgba(123,94,167,0.15)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B72CF" strokeWidth="1.6">
                      <path d="M2 9C2 7.9 2.9 7 4 7H20C21.1 7 22 7.9 22 9V17C22 18.1 21.1 19 20 19H4C2.9 19 2 18.1 2 17V9Z"/>
                      <circle cx="8.5" cy="13" r="2"/><circle cx="15.5" cy="13" r="2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#E8E6F0' }}>{s.scenario}</p>
                    <p className="text-xs" style={{ color: '#8B87A8' }}>{s.date} · {s.duration}</p>
                  </div>
                </div>
                {/* Mini emotion bar */}
                {s.emotions && (
                  <div className="hidden md:flex items-center gap-1">
                    {Object.entries(s.emotions).map(([k, v]) => (
                      <div key={k} className="h-2 rounded-full"
                           style={{ width: v * 0.6, background: { Happy: '#2EC4B6', Neutral: '#FF9F1C', Stressed: '#E84855' }[k] }} />
                    ))}
                  </div>
                )}
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                     style={{
                       background: s.score >= 80 ? 'rgba(46,196,182,0.15)' : 'rgba(255,159,28,0.15)',
                       border: `2px solid ${s.score >= 80 ? '#2EC4B6' : '#FF9F1C'}55`,
                     }}>
                  <span className="text-xs font-bold font-mono"
                        style={{ color: s.score >= 80 ? '#2EC4B6' : '#FF9F1C' }}>
                    {s.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Active VR Session View ──
function RunningSession({ scenario, elapsed, fmt, emotion, setEmotion, confidence, setConfidence, onEnd }) {
  const EMOTIONS = [
    { key: 'Happy',   emoji: '😊', color: '#2EC4B6' },
    { key: 'Neutral', emoji: '😐', color: '#FF9F1C' },
    { key: 'Stressed',emoji: '😟', color: '#E84855' },
  ]
  const current = EMOTIONS.find(e => e.key === emotion) || EMOTIONS[0]

  return (
    <div className="flex-1 p-6 flex flex-col" style={{ background: '#0D0B1E' }}>
      <div className="max-w-3xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#8B87A8' }}>
              Active Session
            </p>
            <h1 className="font-display font-bold text-xl" style={{ color: '#E8E6F0' }}>
              {scenario?.name || 'VR Session'}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#8B87A8' }}>
              {scenario?.desc || 'Immersive skill practice'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-3xl font-bold" style={{ color: '#E8E6F0' }}>
              {fmt(elapsed)}
            </div>
            <button onClick={onEnd} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(232,72,85,0.15)', color: '#E84855',
                             border: '1px solid rgba(232,72,85,0.3)' }}>
              End Session
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Live Emotion */}
          <div className="vr-card p-5">
            <h2 className="font-display font-semibold text-sm mb-4" style={{ color: '#8B87A8' }}>
              LIVE EMOTION
            </h2>
            <div className="flex items-center justify-center gap-6 mb-5">
              {EMOTIONS.map(e => (
                <button key={e.key} onClick={() => setEmotion(e.key)}
                        className="flex flex-col items-center gap-2 transition-all">
                  <div className="relative w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all"
                       style={{
                         background: emotion === e.key ? `${e.color}22` : 'rgba(255,255,255,0.04)',
                         border: `2px solid ${emotion === e.key ? e.color : '#2A2456'}`,
                         transform: emotion === e.key ? 'scale(1.15)' : 'scale(1)',
                       }}>
                    {emotion === e.key && (
                      <div className="ping-slow absolute inset-0 rounded-full"
                           style={{ background: e.color, opacity: 0.3 }} />
                    )}
                    <span>{e.emoji}</span>
                  </div>
                  <span className="text-xs" style={{ color: emotion === e.key ? e.color : '#8B87A8' }}>
                    {e.key}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-center">
              <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: `${current.color}22`, color: current.color }}>
                Current: {emotion}
              </span>
            </div>
          </div>

          {/* Session Stats */}
          <div className="vr-card p-5">
            <h2 className="font-display font-semibold text-sm mb-4" style={{ color: '#8B87A8' }}>
              SESSION STATS
            </h2>
            <div className="flex flex-col gap-4">
              <StatRow label="Duration" value={fmt(elapsed)} color="#7B5EA7" />
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs" style={{ color: '#8B87A8' }}>Confidence</span>
                  <span className="text-xs font-bold" style={{ color: '#E8E6F0' }}>{confidence}%</span>
                </div>
                <input type="range" min="0" max="100" value={confidence}
                       onChange={e => setConfidence(Number(e.target.value))}
                       className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                       style={{ accentColor: '#7B5EA7', background: '#2A2456' }} />
              </div>
              <StatRow label="Scenario"
                       value={scenario?.icon + ' ' + scenario?.name}
                       color="#2EC4B6" />
            </div>
          </div>
        </div>

        {/* Scenario description card */}
        <div className="vr-card p-5 mt-4 flex items-center gap-4">
          <div className="text-4xl">{scenario?.icon}</div>
          <div>
            <p className="font-semibold" style={{ color: '#E8E6F0' }}>{scenario?.name}</p>
            <p className="text-sm mt-1" style={{ color: '#8B87A8' }}>{scenario?.desc}</p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#2EC4B6' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: '#8B87A8' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color }}>{value}</span>
    </div>
  )
}
