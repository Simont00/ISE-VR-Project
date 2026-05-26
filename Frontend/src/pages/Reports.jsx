import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from 'recharts'
import { getReports } from '../services/api'

const EMOTION_TREND = [
  { day: 'May 10', Happy: 60, Neutral: 30, Stressed: 10 },
  { day: 'May 11', Happy: 55, Neutral: 25, Stressed: 20 },
  { day: 'May 12', Happy: 70, Neutral: 20, Stressed: 10 },
  { day: 'May 13', Happy: 50, Neutral: 35, Stressed: 15 },
  { day: 'May 14', Happy: 65, Neutral: 25, Stressed: 10 },
  { day: 'May 15', Happy: 75, Neutral: 15, Stressed: 10 },
]

const SKILLS = [
  { name: 'Communication', score: 85, color: '#7B5EA7' },
  { name: 'Confidence',    score: 70, color: '#5B4FCF' },
  { name: 'Teamwork',      score: 65, color: '#2EC4B6' },
  { name: 'Problem Solving',score: 80, color: '#FF9F1C' },
]

const SUMMARY = { totalSessions: 12, totalTime: '8h 45m', improvement: '+15%', overall: 78 }

export default function Reports() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReports()
      .then(r => setData(r.data))
      .catch(() => setData({ emotionTrend: EMOTION_TREND, skills: SKILLS, summary: SUMMARY }))
      .finally(() => setLoading(false))
  }, [])

  const summary       = data?.summary      || SUMMARY
  const emotionTrend  = data?.emotionTrend || EMOTION_TREND
  const skills        = data?.skills       || SKILLS

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: '#0D0B1E' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl" style={{ color: '#E8E6F0' }}>
            Analytics & Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8B87A8' }}>
            Your progress report and AI-powered insights
          </p>
        </div>

        {/* Overall performance + summary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Overall donut */}
          <div className="vr-card p-5 flex flex-col items-center">
            <h2 className="font-display font-semibold text-sm mb-3 self-start" style={{ color: '#8B87A8' }}>
              OVERALL PERFORMANCE
            </h2>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 120 120" width="144" height="144">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#2A2456" strokeWidth="12"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#7B5EA7" strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 50 * summary.overall / 100} ${2 * Math.PI * 50}`}
                        strokeDashoffset={2 * Math.PI * 50 * 0.25}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s ease' }}/>
              </svg>
              <div className="absolute text-center">
                <p className="font-display font-bold text-3xl" style={{ color: '#E8E6F0' }}>
                  {summary.overall}%
                </p>
                <p className="text-xs" style={{ color: '#8B87A8' }}>Good Job!</p>
              </div>
            </div>
            <div className="w-full mt-4 flex flex-col gap-2">
              <SummaryRow label="Total Sessions"  value={summary.totalSessions} />
              <SummaryRow label="Total Time"      value={summary.totalTime} />
              <SummaryRow label="Improvement"     value={summary.improvement} highlight />
            </div>
          </div>

          {/* Summary cards */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <MetricCard label="Sessions Completed" value={summary.totalSessions} icon="🎮" trend="+3 vs last month" />
            <MetricCard label="Total Practice Time" value={summary.totalTime}    icon="⏱️" trend="Consistent!" />
            <MetricCard label="Avg Improvement"    value={summary.improvement}   icon="📈" trend="vs last month" highlight />
            <MetricCard label="Best Score"         value="92%"                   icon="🏆" trend="Team Session" />
          </div>
        </div>

        {/* Emotion Trend chart */}
        <div className="vr-card p-5 mb-4">
          <h2 className="font-display font-semibold text-base mb-5" style={{ color: '#E8E6F0' }}>
            Emotion Trends
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emotionTrend} margin={{ top: 0, right: 20, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2456" />
              <XAxis dataKey="day" tick={{ fill: '#8B87A8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B87A8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#181535', border: '1px solid #2A2456',
                                       borderRadius: 8, color: '#E8E6F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="Happy"   stroke="#2EC4B6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Neutral" stroke="#FF9F1C" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Stressed"stroke="#E84855" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3">
            {[['Happy','#2EC4B6'],['Neutral','#FF9F1C'],['Stressed','#E84855']].map(([k,c]) => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-6 h-0.5 rounded" style={{ background: c }} />
                <span className="text-xs" style={{ color: '#8B87A8' }}>{k}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="vr-card p-5">
          <h2 className="font-display font-semibold text-base mb-5" style={{ color: '#E8E6F0' }}>
            Skill Breakdown
          </h2>
          <div className="flex flex-col gap-4">
            {skills.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm" style={{ color: '#E8E6F0' }}>{skill.name}</span>
                  <span className="text-sm font-bold font-mono" style={{ color: skill.color }}>
                    {skill.score}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#2A2456' }}>
                  <div className="h-full rounded-full progress-fill"
                       style={{ width: `${skill.score}%`, '--target-width': `${skill.score}%`,
                                background: `linear-gradient(90deg, ${skill.color}aa, ${skill.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#2A2456' }}>
      <span className="text-xs" style={{ color: '#8B87A8' }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: highlight ? '#2EC4B6' : '#E8E6F0' }}>
        {value}
      </span>
    </div>
  )
}

function MetricCard({ label, value, icon, trend, highlight }) {
  return (
    <div className="vr-card p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl">{icon}</span>
        {highlight && (
          <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(46,196,182,0.15)', color: '#2EC4B6' }}>
            ↑ Up
          </span>
        )}
      </div>
      <p className="font-display font-bold text-2xl mb-0.5" style={{ color: '#E8E6F0' }}>{value}</p>
      <p className="text-xs" style={{ color: '#8B87A8' }}>{label}</p>
      <p className="text-xs mt-1" style={{ color: highlight ? '#2EC4B6' : '#5B5780' }}>{trend}</p>
    </div>
  )
}
