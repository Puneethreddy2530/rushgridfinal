import { Zap, Play, Pause, UserPlus, AlertTriangle, Car, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  onAddTraffic?: (active: boolean) => void;
  onSpawnAgent?: () => void;
  onEmergency?: () => void;
  onReset?: () => void;
}

export default function TopNav({
  isPaused,
  setIsPaused,
  onAddTraffic,
  onSpawnAgent,
  onEmergency,
  onReset,
}: TopNavProps) {
  const [addTrafficMode, setAddTrafficMode] = useState(false);

  const handleAddTraffic = () => {
    const newMode = !addTrafficMode;
    setAddTrafficMode(newMode);
    onAddTraffic?.(newMode);
  };

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-bg-primary border-b border-border-default">
      <div className="flex items-center gap-3">
        <div className="bg-accent-red px-3 py-2 rounded-lg">
          <span className="font-display font-bold text-white text-lg">RG</span>
        </div>
        <div>
          <h1 className="font-display text-lg font-bold">RushGrid</h1>
          <span className="text-xs text-text-secondary">PathFuel Engine v1.0</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-3 py-2 text-text-primary hover:bg-bg-card rounded-lg flex items-center gap-2 transition"
          title={isPaused ? 'Resume simulation' : 'Pause simulation'}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span className="text-sm">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          onClick={onSpawnAgent}
          className="px-3 py-2 text-text-primary hover:bg-bg-card rounded-lg flex items-center gap-2 transition"
          title="Add a new agent to the simulation"
        >
          <UserPlus className="w-4 h-4" />
          <span className="text-sm">Spawn Agent</span>
        </button>

        <button
          onClick={onEmergency}
          className="px-3 py-2 text-text-primary hover:bg-bg-card rounded-lg flex items-center gap-2 transition"
          title="Create an emergency vehicle"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Emergency</span>
        </button>

        <button
          onClick={handleAddTraffic}
          className={`px-3 py-2 rounded-lg flex items-center gap-2 transition ${
            addTrafficMode ? 'bg-accent-red/20 text-accent-red' : 'text-text-primary hover:bg-bg-card'
          }`}
          title="Click on grid to add traffic blocks"
        >
          <Car className="w-4 h-4" />
          <span className="text-sm">Add Traffic</span>
        </button>

        <button
          onClick={onReset}
          className="px-3 py-2 text-text-primary hover:bg-bg-card rounded-lg flex items-center gap-2 transition"
          title="Reset the simulation"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>
    </nav>
  );
}