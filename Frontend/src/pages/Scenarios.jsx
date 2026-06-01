import { useSearchParams, useNavigate } from 'react-router-dom'

const SCENARIOS_DATA = {
  greeting: {
    title: '🤝 Greeting Practice',
    description: 'Practice formal and informal social greetings in immersive VR environments.',
    instructions: 'Put on your headset. When the simulation starts, maintain eye contact with the avatar and practice your handshakes and vocal greetings.',
    duration: '10 Mins',
    difficulty: 'Beginner'
  },
  learning: {
    title: '🧠 Learning Practice',
    description: 'Interactive cognitive development module with adaptive tasks and memory tests.',
    instructions: 'Follow the pattern displayed on the visual grid. The sequence will get progressively complex based on your accuracy.',
    duration: '15 Mins',
    difficulty: 'Intermediate'
  },
  emotion: {
    title: '🎭 Emotion Recognition',
    description: 'Identify facial expressions and emotional behaviors in live situational simulation.',
    instructions: 'Look closely at the expressions of the virtual agents. Select the correct corresponding emotion from your controller panel.',
    duration: '12 Mins',
    difficulty: 'Advanced'
  }
}

export default function Scenarios() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const currentModule = searchParams.get('module') || 'greeting'
  const activeData = SCENARIOS_DATA[currentModule] || SCENARIOS_DATA.greeting

  // ── 🚀 START SIMULATION BACKEND PIPELINE SIMULATOR ──
  const handleStartSimulation = () => {
    console.log(`🤖 Triggering Live React Telemetry for: ${currentModule}`);
    
    // Kyunki progress.html khali hai, hum user ko live tracker telemetry simulation active karne ke liye dashboard par navigate karwayenge
    // Isse dashboard par automatic logs load hona shuru ho jayenge
    navigate('/dashboard');
  }

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: '#0D0B1E', minHeight: '100vh', color: '#E8E6F0' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#231E47] pb-3">
          {Object.keys(SCENARIOS_DATA).map((key) => (
            <button
              key={key}
              onClick={() => navigate(`/scenarios?module=${key}`)}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{
                background: currentModule === key ? '#5B4FCF' : 'transparent',
                color: currentModule === key ? '#FFFFFF' : '#8B87A8',
                border: currentModule === key ? '1px solid #7B5EA7' : '1px solid transparent'
              }}
            >
              {SCENARIOS_DATA[key].title.split(' ')[1] + ' ' + (SCENARIOS_DATA[key].title.split(' ')[2] || '')}
            </button>
          ))}
        </div>

        {/* Core Content Window */}
        <div className="vr-card p-6" style={{ background: '#141226', border: '1px solid #231E47', borderRadius: '16px' }}>
          <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: '#5B4FCF22', color: '#9B72CF', border: '1px solid #5B4FCF44' }}>
            {activeData.difficulty} • {activeData.duration}
          </span>
          
          <h1 className="text-3xl font-display font-bold mt-4 mb-2">{activeData.title}</h1>
          <p className="text-sm text-[#8B87A8] mb-6 leading-relaxed">{activeData.description}</p>
          
          <div className="p-4 rounded-xl mb-6" style={{ background: '#0D0B1E', border: '1px solid #231E47' }}>
            <h4 className="text-xs font-semibold mb-2 text-[#9B72CF]">📋 VR TRAINING INSTRUCTIONS</h4>
            <p className="text-sm text-[#E8E6F0] leading-relaxed">{activeData.instructions}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleStartSimulation}
              className="vr-btn cursor-pointer transition-transform transform active:scale-95" 
              style={{ background: '#2EC4B6', color: '#0D0B1E', fontWeight: 'bold' }}
            >
              ▶️ Start VR Simulation
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 text-sm rounded-xl font-medium cursor-pointer" style={{ background: '#231E47', color: '#8B87A8' }}>
              Back to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}