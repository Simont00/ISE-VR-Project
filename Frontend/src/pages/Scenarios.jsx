import { useSearchParams, useNavigate } from 'react-router-dom'

const SCENARIOS_DATA = {
  greeting: {
    title: '🤝 Greeting Practice',
    description: 'Practice formal and informal social greetings in immersive VR environments.',
    instructions: 'Read each question carefully and choose the most appropriate social greeting response. A voice guide will read the question aloud.',
    duration: '10 Mins', difficulty: 'Beginner', diffColor: '#9B72CF',
    route: '/greeting-scenerio',
  },
  emotion: {
    title: '🎭 Emotion Recognition',
    description: 'Identify facial expressions and emotional behaviors in live situational simulation.',
    instructions: 'Look closely at the emotion image shown and select the correct feeling from the options provided.',
    duration: '12 Mins', difficulty: 'Advanced', diffColor: '#2EC4B6',
    route: '/emotion-scenerio',
  },
  social: {
    title: '🤜 Social Situations',
    description: 'Navigate real-life social interactions and develop empathy in everyday scenarios.',
    instructions: 'Each scenario presents a real social situation. Choose the most kind and appropriate response.',
    duration: '10 Mins', difficulty: 'Intermediate', diffColor: '#FF9F1C',
    route: '/social-scenerio',
  },
}

export default function Scenarios() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentModule = searchParams.get('module') || 'greeting'
  const activeData = SCENARIOS_DATA[currentModule] || SCENARIOS_DATA.greeting

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#0D0B1E', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8E6F0', margin: '0 0 4px' }}>VR Scenarios</h1>
          <p style={{ fontSize: '13px', color: '#8B87A8', margin: 0 }}>Choose a module and begin your immersive practice session</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #231E47', paddingBottom: '1px' }}>
          {Object.entries(SCENARIOS_DATA).map(([key, data]) => (
            <button key={key} onClick={() => navigate(`/scenarios?module=${key}`)}
              style={{
                padding: '9px 18px', fontSize: '13px', fontWeight: '600', borderRadius: '10px 10px 0 0',
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: currentModule === key ? '#141226' : 'transparent',
                color: currentModule === key ? '#E8E6F0' : '#8B87A8',
                borderBottom: currentModule === key ? '2px solid #7B5EA7' : '2px solid transparent',
              }}>
              {data.title.split(' ')[0]} {data.title.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Scenario cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {Object.entries(SCENARIOS_DATA).map(([key, data]) => (
            <div key={key} onClick={() => navigate(`/scenarios?module=${key}`)}
              style={{
                background: currentModule === key ? 'rgba(123,94,167,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${currentModule === key ? '#7B5EA7' : '#231E47'}`,
                borderRadius: '14px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s',
              }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{data.title.split(' ')[0]}</div>
              <p style={{ margin: '0 0 6px', fontWeight: '600', fontSize: '14px', color: '#E8E6F0' }}>
                {data.title.split(' ').slice(1).join(' ')}
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#8B87A8', lineHeight: '1.5' }}>{data.description}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', background: `${data.diffColor}18`, color: data.diffColor, border: `1px solid ${data.diffColor}33` }}>
                  {data.difficulty}
                </span>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: '#8B87A8', border: '1px solid #2A2456' }}>
                  {data.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Active module detail */}
        <div style={{ background: '#141226', border: '1px solid #231E47', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '999px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', background: `${activeData.diffColor}15`, color: activeData.diffColor, border: `1px solid ${activeData.diffColor}30` }}>
              {activeData.difficulty}
            </span>
            <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: '#8B87A8', border: '1px solid #2A2456' }}>
              ⏱ {activeData.duration}
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#E8E6F0', margin: '0 0 8px' }}>{activeData.title}</h2>
          <p style={{ fontSize: '13px', color: '#8B87A8', marginBottom: '20px', lineHeight: '1.6' }}>{activeData.description}</p>

          <div style={{ background: '#0D0B1E', border: '1px solid #231E47', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#9B72CF', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📋 Instructions
            </h4>
            <p style={{ fontSize: '13px', color: '#C4C0D8', margin: 0, lineHeight: '1.6' }}>{activeData.instructions}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate(activeData.route)}
              style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #7B5EA7, #5B4FCF)', color: '#fff', fontWeight: '700', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 16px rgba(123,94,167,0.35)' }}>
              ▶ Start Simulation
            </button>
            <button onClick={() => navigate('/dashboard')}
              style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '12px', border: '1px solid #2A2456', background: 'rgba(255,255,255,0.04)', color: '#8B87A8', cursor: 'pointer', fontWeight: '500' }}>
              ← Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
