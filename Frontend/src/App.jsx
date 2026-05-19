import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GreetingScenerio from "./pages/GreetingScenerio";
import EmotionScenerio from "./pages/EmotionScenerio"; // ✅ NEW

// ❌ VR TEMP DISABLED
// import VRClassroomScene from "./pages/VRClassroomScene";

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-blue-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Greeting */}
          <Route path="/scenerio/greeting" element={<GreetingScenerio />} />

          {/* ✅ Emotion Scenario */}
          <Route path="/scenerio/emotion" element={<EmotionScenerio />} />

          {/* ❌ VR ROUTE DISABLED */}
          {/* <Route path="/vr" element={<VRClassroomScene />} /> */}
        </Routes>
        </div>
    </BrowserRouter>
  );
};

export default App;