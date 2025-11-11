import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, UserPlus, AlertTriangle, RotateCcw } from 'lucide-react';
import GridCanvas from '../components/GridCanvas';
import MetricsSidebar from '../components/MetricsSidebar';
import RushBotPanel from '../components/RushBotPanel';
import DeveloperFooter from '../components/DeveloperFooter';
import { Agent, Algorithm } from '../types/agent';
import { aStar, biAStar, dynamicAStar } from '../utils/pathfinding';

const GRID_SIZE = 30;

// Default source and destination zones
const DEFAULT_SOURCE_ZONE = { x: { min: 2, max: 5 }, y: { min: 2, max: 5 } };
const DEFAULT_DESTINATION_ZONE = { x: { min: 24, max: 27 }, y: { min: 24, max: 27 } };

export default function Simulation() {
  const [isPaused, setIsPaused] = useState(false);
  const [obstacles, setObstacles] = useState<Set<string>>(new Set());
  const [agents, setAgents] = useState<Agent[]>([]);
  const [emergencyAgentId, setEmergencyAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ from: 'bot' | 'user'; text: string }>>([
    { from: 'bot', text: "Hey! I'm RushBot! Click 'Spawn Agent' to add moving dots, or click grid cells to add obstacles! Agents travel from source (green) to destination (purple)!" },
  ]);
  
  // Custom zone states
  const [sourceZone, setSourceZone] = useState(DEFAULT_SOURCE_ZONE);
  const [destinationZone, setDestinationZone] = useState(DEFAULT_DESTINATION_ZONE);
  const [showZoneConfig, setShowZoneConfig] = useState(false);
  // Selection mode: 'none' | 'source' | 'destination'
  const [selectMode, setSelectMode] = useState<'none' | 'source' | 'destination'>('none');

  // Spawn agent with random algorithm
  const spawnAgent = useCallback((algorithm?: Algorithm, isEmergency = false, isManualSpawn = false) => {
    const algorithms: Algorithm[] = ['A*', 'Bi-A*', 'Dynamic A*'];
    const selectedAlgo = algorithm || algorithms[Math.floor(Math.random() * algorithms.length)];
    
    const algorithmColors = {
      'A*': '#d50032', // red
      'Bi-A*': '#3b4cca', // blue
      'Dynamic A*': '#cccccc', // white
    };

    // Random spawn point within source zone
    const startX = sourceZone.x.min + Math.floor(Math.random() * (sourceZone.x.max - sourceZone.x.min + 1));
    const startY = sourceZone.y.min + Math.floor(Math.random() * (sourceZone.y.max - sourceZone.y.min + 1));
    
    // Random destination within destination zone
    const targetX = destinationZone.x.min + Math.floor(Math.random() * (destinationZone.x.max - destinationZone.x.min + 1));
    const targetY = destinationZone.y.min + Math.floor(Math.random() * (destinationZone.y.max - destinationZone.y.min + 1));

    const pathfinder = selectedAlgo === 'A*' ? aStar : selectedAlgo === 'Bi-A*' ? biAStar : dynamicAStar;
    const result = pathfinder({ x: startX, y: startY }, { x: targetX, y: targetY }, GRID_SIZE, obstacles);

    // Yellow for manual spawn, cyan for emergency, algorithm color otherwise
    let agentColor = algorithmColors[selectedAlgo];
    if (isEmergency) {
      agentColor = '#00ffff'; // cyan for emergency
    } else if (isManualSpawn) {
      agentColor = '#fbbf24'; // yellow for manual spawn
    }

    const newAgent: Agent = {
      id: `agent-${Date.now()}-${Math.random()}`,
      x: startX,
      y: startY,
      targetX,
      targetY,
      path: result.path.slice(1),
      algorithm: selectedAlgo,
      isEmergency,
      color: agentColor,
      pathCost: result.cost,
      nodesExplored: result.nodesExplored,
      startTime: Date.now(),
    };

    setAgents((prev) => [...prev, newAgent]);
    setMessages((prev) => [
      ...prev,
      { from: 'bot', text: `🎯 Agent spawned using ${selectedAlgo}! Moving from (${startX},${startY}) to (${targetX},${targetY}). Path length: ${result.path.length}` },
    ]);

    return newAgent.id;
  }, [obstacles, sourceZone, destinationZone]);

  // Emergency mode
  const activateEmergency = useCallback(() => {
    const agentId = spawnAgent('A*', true, false);
    setEmergencyAgentId(agentId);
    setMessages((prev) => [...prev, { from: 'bot', text: '🚨 Emergency mode activated! Priority agent dispatched!' }]);
  }, [spawnAgent]);

  // Helpers to set a zone centered around a clicked cell (3x3 by default)
  const placeZoneAt = useCallback((x: number, y: number, which: 'source' | 'destination') => {
    const radius = 1; // 3x3
    const minX = Math.max(0, x - radius);
    const maxX = Math.min(GRID_SIZE - 1, x + radius);
    const minY = Math.max(0, y - radius);
    const maxY = Math.min(GRID_SIZE - 1, y + radius);

    const zone = { x: { min: minX, max: maxX }, y: { min: minY, max: maxY } };

    if (which === 'source') {
      setSourceZone(zone);
      setMessages((prev) => [...prev, { from: 'bot', text: `🟢 Source zone set to (${minX}-${maxX}, ${minY}-${maxY})` }]);
    } else {
      setDestinationZone(zone);
      setMessages((prev) => [...prev, { from: 'bot', text: `🟣 Destination zone set to (${minX}-${maxX}, ${minY}-${maxY})` }]);
    }

    setSelectMode('none');
    setShowZoneConfig(false);
  }, []);

  // Preset quick sets
  const applyPreset = useCallback((preset: 'tl' | 'br' | 'center') => {
    if (preset === 'tl') {
      setSourceZone({ x: { min: 0, max: 3 }, y: { min: 0, max: 3 } });
      setDestinationZone({ x: { min: GRID_SIZE - 4, max: GRID_SIZE - 1 }, y: { min: GRID_SIZE - 4, max: GRID_SIZE - 1 } });
    } else if (preset === 'br') {
      setSourceZone({ x: { min: GRID_SIZE - 4, max: GRID_SIZE - 1 }, y: { min: GRID_SIZE - 4, max: GRID_SIZE - 1 } });
      setDestinationZone({ x: { min: 0, max: 3 }, y: { min: 0, max: 3 } });
    } else {
      const c1 = Math.floor(GRID_SIZE / 2) - 1;
      setSourceZone({ x: { min: c1, max: c1 + 1 }, y: { min: c1, max: c1 + 1 } });
      setDestinationZone({ x: { min: c1 + 2, max: c1 + 3 }, y: { min: c1 + 2, max: c1 + 3 } });
    }
    setMessages((prev) => [...prev, { from: 'bot', text: `⚡ Preset applied: ${preset}` }]);
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setAgents([]);
    setObstacles(new Set());
    setEmergencyAgentId(null);
    setIsPaused(false);
    setMessages((prev) => [...prev, { from: 'bot', text: '✅ Simulation reset! Grid cleared and ready.' }]);
  }, []);

  // Recalculate paths when obstacles change
  useEffect(() => {
    if (obstacles.size === 0) return;

    setAgents((prev) =>
      prev.map((agent) => {
        // Recalculate path from current position to target
        const pathfinder = agent.algorithm === 'A*' ? aStar : agent.algorithm === 'Bi-A*' ? biAStar : dynamicAStar;
        const result = pathfinder({ x: agent.x, y: agent.y }, { x: agent.targetX, y: agent.targetY }, GRID_SIZE, obstacles);
        
        if (result.path.length > 0) {
          setMessages((prev) => [
            ...prev,
            { from: 'bot', text: `⚡ Agent ${agent.id.slice(0, 8)} rerouting using ${agent.algorithm} due to obstacle change!` },
          ]);
        }

        return { 
          ...agent, 
          path: result.path.slice(1), // Remove current position
          pathCost: result.cost, 
          nodesExplored: result.nodesExplored 
        };
      })
    );
  }, [obstacles]);

  // Move agents along path (animation loop)
  useEffect(() => {
    if (isPaused || agents.length === 0) return;

    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          // If path is empty, agent reached destination
          if (agent.path.length === 0) {
            // Agent reached destination zone, now go back to source zone
            const isAtDestination = agent.targetX >= destinationZone.x.min && agent.targetX <= destinationZone.x.max &&
                                   agent.targetY >= destinationZone.y.min && agent.targetY <= destinationZone.y.max;
            
            let targetX: number, targetY: number;
            
            if (isAtDestination) {
              // Return to source zone
              targetX = sourceZone.x.min + Math.floor(Math.random() * (sourceZone.x.max - sourceZone.x.min + 1));
              targetY = sourceZone.y.min + Math.floor(Math.random() * (sourceZone.y.max - sourceZone.y.min + 1));
            } else {
              // Go to destination zone
              targetX = destinationZone.x.min + Math.floor(Math.random() * (destinationZone.x.max - destinationZone.x.min + 1));
              targetY = destinationZone.y.min + Math.floor(Math.random() * (destinationZone.y.max - destinationZone.y.min + 1));
            }
            
            const pathfinder = agent.algorithm === 'A*' ? aStar : agent.algorithm === 'Bi-A*' ? biAStar : dynamicAStar;
            const result = pathfinder({ x: agent.x, y: agent.y }, { x: targetX, y: targetY }, GRID_SIZE, obstacles);

            return {
              ...agent,
              targetX,
              targetY,
              path: result.path.slice(1),
              pathCost: result.cost,
              nodesExplored: result.nodesExplored,
            };
          }

          // Move to next position in path
          const nextPos = agent.path[0];
          const newPath = agent.path.slice(1);

          return { 
            ...agent, 
            x: nextPos.x, 
            y: nextPos.y, 
            path: newPath 
          };
        })
      );
    }, 300); // Move every 300ms

    return () => clearInterval(interval);
  }, [isPaused, agents.length, obstacles, sourceZone, destinationZone]);

  // Spawn initial agents on mount
  useEffect(() => {
    // Spawn 3 initial agents with algorithm colors (not yellow)
    setTimeout(() => spawnAgent('A*', false, false), 100);
    setTimeout(() => spawnAgent('Bi-A*', false, false), 200);
    setTimeout(() => spawnAgent('Dynamic A*', false, false), 300);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-8 py-3 bg-black border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-[#d50032] px-3 py-2 rounded-lg">
            <span className="font-display font-bold text-white text-lg">RG</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">RushGrid</h1>
            <span className="text-xs text-gray-400">PathFuel Engine v1.0</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-sm">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          <button 
            onClick={() => spawnAgent(undefined, false, true)} 
            className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-sm">Spawn Agent</span>
          </button>
          <button onClick={activateEmergency} className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Emergency</span>
          </button>
          <button onClick={resetSimulation} className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition">
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
          <button 
            onClick={() => setShowZoneConfig(!showZoneConfig)} 
            className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition"
          >
            <span className="text-sm">⚙️ Zones</span>
          </button>
          {/* Presets and click-to-set toggles */}
          <button onClick={() => applyPreset('tl')} className="px-2 py-2 text-sm text-white hover:bg-gray-800 rounded-lg">TL</button>
          <button onClick={() => applyPreset('center')} className="px-2 py-2 text-sm text-white hover:bg-gray-800 rounded-lg">Center</button>
          <button onClick={() => applyPreset('br')} className="px-2 py-2 text-sm text-white hover:bg-gray-800 rounded-lg">BR</button>
          <button
            onClick={() => setSelectMode(selectMode === 'source' ? 'none' : 'source')}
            className={`px-3 py-2 text-sm rounded-lg ${selectMode === 'source' ? 'bg-green-700' : 'text-white hover:bg-gray-800'}`}
          >
            Set Source
          </button>
          <button
            onClick={() => setSelectMode(selectMode === 'destination' ? 'none' : 'destination')}
            className={`px-3 py-2 text-sm rounded-lg ${selectMode === 'destination' ? 'bg-purple-700' : 'text-white hover:bg-gray-800'}`}
          >
            Set Destination
          </button>
        </div>
      </nav>

      {/* Zone Configuration Panel */}
      {showZoneConfig && (
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">
            {/* Source Zone Config */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Source Zone
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">X Min</label>
                  <input 
                    type="number" 
                    value={sourceZone.x.min} 
                    onChange={(e) => setSourceZone({...sourceZone, x: {...sourceZone.x, min: Math.max(0, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">X Max</label>
                  <input 
                    type="number" 
                    value={sourceZone.x.max} 
                    onChange={(e) => setSourceZone({...sourceZone, x: {...sourceZone.x, max: Math.min(GRID_SIZE - 1, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Y Min</label>
                  <input 
                    type="number" 
                    value={sourceZone.y.min} 
                    onChange={(e) => setSourceZone({...sourceZone, y: {...sourceZone.y, min: Math.max(0, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Y Max</label>
                  <input 
                    type="number" 
                    value={sourceZone.y.max} 
                    onChange={(e) => setSourceZone({...sourceZone, y: {...sourceZone.y, max: Math.min(GRID_SIZE - 1, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Destination Zone Config */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Destination Zone
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">X Min</label>
                  <input 
                    type="number" 
                    value={destinationZone.x.min} 
                    onChange={(e) => setDestinationZone({...destinationZone, x: {...destinationZone.x, min: Math.max(0, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">X Max</label>
                  <input 
                    type="number" 
                    value={destinationZone.x.max} 
                    onChange={(e) => setDestinationZone({...destinationZone, x: {...destinationZone.x, max: Math.min(GRID_SIZE - 1, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Y Min</label>
                  <input 
                    type="number" 
                    value={destinationZone.y.min} 
                    onChange={(e) => setDestinationZone({...destinationZone, y: {...destinationZone.y, min: Math.max(0, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Y Max</label>
                  <input 
                    type="number" 
                    value={destinationZone.y.max} 
                    onChange={(e) => setDestinationZone({...destinationZone, y: {...destinationZone.y, max: Math.min(GRID_SIZE - 1, parseInt(e.target.value) || 0)}})}
                    min="0" max={GRID_SIZE - 1}
                    className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <GridCanvas
          gridSize={GRID_SIZE}
          obstacles={obstacles}
          setObstacles={setObstacles}
          agents={agents}
          sourceZone={sourceZone}
          destinationZone={destinationZone}
          selectMode={selectMode}
          onSelectCell={(x, y) => {
            if (selectMode === 'source') placeZoneAt(x, y, 'source');
            else if (selectMode === 'destination') placeZoneAt(x, y, 'destination');
          }}
        />
        <MetricsSidebar agents={agents} />
      </div>

      <RushBotPanel
        messages={messages}
        onSendMessage={(msg) => {
          setMessages((prev) => [...prev, { from: 'user', text: msg }]);
          
          const lowerMsg = msg.toLowerCase();
          
          if (lowerMsg.includes('spawn') || lowerMsg.includes('agent')) {
            spawnAgent();
          } else if (lowerMsg.includes('emergency')) {
            activateEmergency();
          } else if (lowerMsg.includes('reset')) {
            resetSimulation();
          } else if (lowerMsg.includes('pause')) {
            setIsPaused(true);
            setMessages((prev) => [...prev, { from: 'bot', text: '⏸️ Simulation paused!' }]);
          } else if (lowerMsg.includes('resume') || lowerMsg.includes('play')) {
            setIsPaused(false);
            setMessages((prev) => [...prev, { from: 'bot', text: '▶️ Simulation resumed!' }]);
          } else {
            setMessages((prev) => [...prev, { from: 'bot', text: '💡 Try: "spawn agent", "emergency", "reset", "pause", or "resume"!' }]);
          }
        }}
      />
      <DeveloperFooter />
    </div>
  );
}