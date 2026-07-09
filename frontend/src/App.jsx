import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import StudyHub from "./pages/StudyHub.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import Analytics from "./pages/Analytics.jsx";
import Blocker from "./pages/Blocker.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/study-hub" element={<StudyHub />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/blocker" element={<Blocker />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/study-hub" replace />} />
    </Routes>
  );
}
