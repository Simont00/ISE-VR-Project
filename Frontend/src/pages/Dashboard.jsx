import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'

const EMOTION_COLORS = { happy: '#2EC4B6', neutral: '#FF9F1C', sad: '#E84855', fear: '#3A86FF', angry: '#FF006E' }

const VR_SCENARIOS = [
  { id: 'greeting', title: 'Greeting Practice', description: 'Practice formal and informal social greetings in immersive VR.', icon: '🤝', color: '#7B5EA7' },
  { id: 'learning', title: 'Learning Practice', description: 'Interactive cognitive development module with adaptive tasks.', icon: '🧠', color: '#5B4FCF' },
  { id: 'emotion', title: 'Emotion Recognition', description: 'Identify facial expressions and behaviors in live environments.', icon: '🎭', color: '#2EC4B6' }
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [liveEmotion, setLiveEmotion] = useState('Detecting...')
  const [liveAdvice, setLiveAdvice] = useState('Waiting for telemetry matrix...')
  const [engagementScore, setEngagementScore] = useState(60)
  const [totalInterventions, setTotalInterventions] = useState(0)
  const [interventionActive, setInterventionActive] = useState(false)
  const [chartData, setChartData] = useState([
    { name: 'happy', value: 1 },
    { name: 'neutral', value: 2 },
    { name: 'sad', value: 0 }
  ])

  // Live Telemetry Sync Pipeline
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const response = await fetch('/api/dashboard-stats')
        if (!response.ok) return;
        const data = await response.json()

        if (data && data.status === 'success') {
          setLiveEmotion(data.current_emotion || 'neutral')
          setEngagementScore(data.engagement_score || 60)
          setTotalInterventions(data.total_interventions || 0)
          setInterventionActive(data.intervention_active || false)
          setLiveAdvice(data.advice || 'Monitoring...')

          if (data.intervention_active) {
            let audio = new Audio('/static/calm_sound.mp3')
            audio.play().catch(err => console.log("Audio block:", err))
          }

          if (data.chart_data) {
            const formattedChart = Object.keys(data.chart_data).map(key => ({
              name: key,
              value: data.chart_data[key]
            }))
            setChartData(formattedChart)
          }
        }
      } catch (error) {
        console.log("Dashboard live sync error:", error)
      }
    }

    fetchLiveStats()
    const interval = setInterval(fetchLiveStats, 2000)
    return () => clearInterval(interval)
  }, [])

  // 🎯 SMART PARAMETER ROUTING FOR EXPERIMENTS
 // 🎯 ROUTING CLICKS TO DEDICATED SCENARIOS PAGE
 // 🎯 CONNECTING INTERACTIVE CARDS TO RESTORED PARTNER PACKAGES
  const handleScenarioClick = (scenId) => {
    console.log(`Launching live interactive block: ${scenId}`);
    
    if (scenId === 'greeting') {
      navigate('/greeting-scenerio');
    } else if (scenId === 'emotion') {
      navigate('/emotion-scenerio');
    } else if (scenId === 'learning' || scenId === 'social') {
      navigate('/social-scenerio');
    }
  };
  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: '#0D0B1E', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: '#E8E6F0' }}>
              Welcome, {firstName}!
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8B87A8' }}>
              Real-time VR Telemetry Monitoring System Active.
            </p>
          </div>
          <button onClick={() => navigate('/sessions')} className="vr-btn px-5" style={{ width: 'auto' }}>
            + View Full Sessions
          </button>
        </div>

        {/* Live Tracking Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="vr-card p-5" style={{ background: '#141226', border: interventionActive ? '1px solid #E84855' : '1px solid #231E47', borderRadius: '16px' }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: '#8B87A8' }}>LIVE EMOTION TRACKER</h3>
            <div className="flex items-baseline gap-3">
              <span id="emotion-display" className="text-3xl font-display font-bold uppercase tracking-wider" style={{ color: interventionActive ? '#E84855' : '#2EC4B6' }}>
                {liveEmotion}
              </span>
              {interventionActive && <span className="text-xs font-bold animate-pulse" style={{ color: '#E84855' }}>⚠️ BREAK TRIGGERED</span>}
            </div>
          </div>

          <div className="vr-card p-5" style={{ background: '#141226', border: '1px solid #231E47', borderRadius: '16px' }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: '#8B87A8' }}>AI ANALYSIS & RECOMMENDATION</h3>
            <p className="text-sm font-medium" style={{ color: '#E8E6F0' }}>
              {interventionActive ? "⚠️ Sensory Break Active: Playing calm_sound.mp3" : liveAdvice}
            </p>
          </div>
        </div>

        {/* Core VR Practice Modules Grid */}
        <div className="mb-6">
          <h2 className="font-display font-semibold text-base mb-4" style={{ color: '#E8E6F0' }}>
            🔮 Core VR Practice Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VR_SCENARIOS.map((scen) => (
              <div 
                key={scen.id} 
                className="vr-card p-4 flex flex-col justify-between cursor-pointer hover:border-[#9B72CF] transition-all transform hover:-translate-y-0.5"
                style={{ background: '#141226', border: '1px solid #231E47', borderRadius: '12px' }}
                onClick={() => handleScenarioClick(scen.id)}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-xl" style={{ background: `${scen.color}22` }}>
                    {scen.icon}
                  </div>
                  <h3 className="font-display font-bold text-sm mb-1" style={{ color: '#E8E6F0' }}>{scen.title}</h3>
                  <p className="text-xs" style={{ color: '#8B87A8', lineHeight: '1.4' }}>{scen.description}</p>
                </div>
                <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#231E47] text-xs">
                  <span style={{ color: scen.color }}>Ready</span>
                  <span style={{ color: '#9B72CF' }}>Open Module →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon="📊" label="Live Engagement" value={`${engagementScore}%`} color="#2EC4B6" />
          <StatCard icon="🚨" label="Total Interventions" value={totalInterventions} color="#E84855" />
          <StatCard icon="⏱️" label="Session Timer" value="Live Syncing" color="#5B4FCF" />
          <StatCard icon="🔥" label="Active Pipeline" value="Operational" color="#FF9F1C" />
        </div>

        {/* Chart */}
        <div className="vr-card p-5 flex flex-col md:w-1/2 mx-auto">
          <h2 className="font-display font-semibold text-sm mb-3" style={{ color: '#E8E6F0' }}>Real-time Emotion Distribution</h2>
          <div className="flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={EMOTION_COLORS[e.name.toLowerCase()] || '#FF9F1C'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#181535', border: '1px solid #2A2456', borderRadius: 8, color: '#E8E6F0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            {chartData.map(e => (
              <div key={e.name} className="text-xs">
                <span className="capitalize block font-semibold" style={{ color: EMOTION_COLORS[e.name.toLowerCase()] }}>{e.name}</span>
                <span style={{ color: '#E8E6F0' }}>{e.value} hits</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="vr-card p-4" style={{ background: '#141226', border: '1px solid #231E47', borderRadius: '12px' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-base" style={{ background: `${color}22` }}>{icon}</div>
      <p className="text-xs mb-0.5" style={{ color: '#8B87A8' }}>{label}</p>
      <p className="font-display font-bold text-lg" style={{ color: '#E8E6F0' }}>{value}</p>
    </div>
  )
}