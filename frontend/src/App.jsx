import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Diet from './pages/Diet';
import Progress from './pages/Progress';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Layout>
  );
}
