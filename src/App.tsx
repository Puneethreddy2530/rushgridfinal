import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Simulation from './pages/Simulation';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/simulation" element={<Simulation />} />
    </Routes>
  );
}