import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import GreetingScenerio from "./pages/GreetingScenerio";
import EmotionScenerio from "./pages/EmotionScenerio";
import SocialScenerio from "./pages/SocialScenerio";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/greeting" element={<GreetingScenerio />} />
        <Route path="/emotion" element={<EmotionScenerio />} />
        <Route path="/social" element={<SocialScenerio />} />
      </Routes>
    </BrowserRouter>
  );
}