import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── 🔮 ADDED SCENARIOS HERE IN THE MENU MATRIX ──
const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: DashIcon },
  { to: '/scenarios', label: 'Scenarios', icon: ScenariosIcon }, // 👈 Yeh naya option add kar diya hai
  { to: '/sessions',  label: 'Sessions',  icon: SessionIcon },
  { to: '/reports',   label: 'Reports',   icon: ReportIcon },
  { to: '/profile',   label: 'Profile',   icon: ProfileIcon },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex flex-col h-screen w-56 shrink-0 border-r"
           style={{ background: '#0F0D24', borderColor: '#2A2456' }}>

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-6 border-b" style={{ borderColor: '#2A2456' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'linear-gradient(135deg, #7B5EA7, #5B4FCF)' }}>
          <VRIcon />
        </div>
        <div>
          <p className="font-display font-bold text-sm leading-tight" style={{ color: '#E8E6F0' }}>ISE VR</p>
          <p className="text-xs" style={{ color: '#8B87A8' }}>Skills Enhancer</p>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
               ${isActive ? 'active text-white' : ''}`
            }
            style={({ isActive }) => ({
              color: isActive ? '#E8E6F0' : '#8B87A8',
              background: isActive ? 'rgba(123,94,167,0.18)' : 'transparent',
              borderLeft: isActive ? '3px solid #9B72CF' : '3px solid transparent',
            })}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── User + Logout ── */}
      <div className="px-3 pb-5 border-t pt-4" style={{ borderColor: '#2A2456' }}>
        {/* User chip */}
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
               style={{ background: 'linear-gradient(135deg, #7B5EA7, #5B4FCF)', color: 'white' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#E8E6F0' }}>
              {user?.name || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: '#8B87A8' }}>
              {user?.email || ''}
            </p>
          </div>
        </div>
        {/* Logout */}
        <button onClick={handleLogout}
                className="sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{ color: '#8B87A8' }}>
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  )
}

/* ── Inline SVG Icons ── */
function VRIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V9Z" stroke="white" strokeWidth="1.5"/>
      <circle cx="8.5" cy="13" r="2.5" stroke="white" strokeWidth="1.5"/>
      <circle cx="15.5" cy="13" r="2.5" stroke="white" strokeWidth="1.5"/>
      <path d="M11 13H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function DashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}
// New Futuristic Crystal Ball Icon for Scenarios Section
function ScenariosIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M12 6v12M6 12h12"/>
    </svg>
  )
}
function SessionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V9Z"/>
      <circle cx="8.5" cy="13" r="2"/>
      <circle cx="15.5" cy="13" r="2"/>
      <line x1="11" y1="13" x2="13" y2="13"/>
    </svg>
  )
}
function ReportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 19V6l-2 2M15 19V4M21 19H3"/>
    </svg>
  )
}
function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}