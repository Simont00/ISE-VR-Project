import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import GreetingScenerio from "./pages/GreetingScenerio";
import EmotionScenerio from "./pages/EmotionScenerio";
import SocialScenerio from "./pages/SocialScenerio";
import SessionPage from "./pages/SessionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/greeting" element={<GreetingScenerio />} />
        <Route path="/emotion" element={<EmotionScenerio />} />
        <Route path="/social" element={<SocialScenerio />} />
        <Route path="/session" element={<SessionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import Sidebar from './Components/SideBar'
import Login    from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Sessions  from './pages/Sessions'
import Reports   from './pages/Reports'
import Profile   from './pages/Profile'
import Scenarios from './pages/Scenarios' 
import GreetingScenerio from './pages/GreetingScenerio'
import EmotionScenerio from './pages/EmotionScenerio'
import SocialScenerio from './pages/SocialScenerio'
// Layout wrapper: Sidebar + main content area
function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#0D0B1E' }}>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected routes (require login) ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <AppLayout><Sessions /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <AppLayout><Reports /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout><Profile /></AppLayout>
            </ProtectedRoute>
          } />
       <Route path="/scenarios" element={
        <ProtectedRoute>
    <AppLayout><Scenarios /></AppLayout>
      </ProtectedRoute>
             } />
             <Route path="/greeting-scenerio" element={<ProtectedRoute><AppLayout><GreetingScenerio /></AppLayout></ProtectedRoute>} />
<Route path="/emotion-scenerio" element={<ProtectedRoute><AppLayout><EmotionScenerio /></AppLayout></ProtectedRoute>} />
<Route path="/social-scenerio" element={<ProtectedRoute><AppLayout><SocialScenerio /></AppLayout></ProtectedRoute>} />
          {/* ── Default redirect ── */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

