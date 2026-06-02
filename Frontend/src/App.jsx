import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// components
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/SideBar'

// pages
import Dashboard from './pages/Dashboard'
import GreetingScenerio from './pages/GreetingScenerio'
import EmotionScenerio from './pages/EmotionScenerio'
import SocialScenerio from './pages/SocialScenerio'
import SessionPage from './pages/SessionPage'

import Login from './pages/Login'
import Register from './pages/Register'
import Sessions from './pages/Sessions'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Scenarios from './pages/Scenarios'

// layout wrapper (clean small component style)
const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0D0B1E]">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

// protected wrapper (clean reusable)
const Protected = ({ children }) => {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES */}
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/sessions" element={<Protected><SessionPage /></Protected>} />
          <Route path="/reports" element={<Protected><Reports /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/scenarios" element={<Protected><Scenarios /></Protected>} />

          {/* SCENARIO ROUTES */}
          <Route path="/greeting-scenerio" element={<Protected><GreetingScenerio /></Protected>} />
          <Route path="/emotion-scenerio" element={<Protected><EmotionScenerio /></Protected>} />
          <Route path="/social-scenerio" element={<Protected><SocialScenerio /></Protected>} />
          <Route path="/session" element={<Protected><SessionPage /></Protected>} />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}