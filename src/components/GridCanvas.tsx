import { motion } from 'framer-motion';
import { Agent } from '../types/agent';
import { useState, useEffect, useRef } from 'react';

interface Zone {
  x: { min: number; max: number };
  y: { min: number; max: number };
}

interface GridCanvasProps {
  gridSize: number;
  obstacles: Set<string>;
  setObstacles: (obstacles: Set<string>) => void;
  agents: Agent[];
  sourceZone: Zone;
  destinationZone: Zone;
  selectMode?: 'none' | 'source' | 'destination';
  onSelectCell?: (x: number, y: number) => void;
}

export default function GridCanvas({
  gridSize,
  obstacles,
  setObstacles,
  agents,
  sourceZone,
  destinationZone,
  selectMode = 'none',
  onSelectCell,
}: GridCanvasProps) {
  const [agentTrails, setAgentTrails] = useState<
    Map<string, Array<{ x: number; y: number }>>
  >(new Map());
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cellSize = 20;

  // Track agent trails
  useEffect(() => {
    const newTrails = new Map(agentTrails);

    agents.forEach((agent) => {
      const trail = newTrails.get(agent.id) || [];
      trail.push({ x: agent.x, y: agent.y });

      if (trail.length > 8) trail.shift(); // keep last 8 positions
      newTrails.set(agent.id, trail);
    });

    setAgentTrails(new Map(newTrails));
  }, [agents]);

  const handleCellClick = (x: number, y: number, isRightClick: boolean) => {
    if (selectMode !== 'none' && onSelectCell) {
      onSelectCell(x, y);
      return;
    }

    const key = `${x},${y}`;
    const newObstacles = new Set(obstacles);

    if (isRightClick) newObstacles.delete(key);
    else newObstacles.add(key);

    setObstacles(newObstacles);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#0d0d0d] overflow-hidden">
      {/* Legend */}
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-900 rounded" />
          <span className="text-gray-300">Source Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-900 rounded" />
          <span className="text-gray-300">Destination Zone</span>
        </div>
      </div>

      {/* Grid Container */}
      <div
        ref={gridContainerRef}
        className="flex-1 flex justify-center items-center bg-gray-900 rounded-lg overflow-auto relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="grid gap-[1px] bg-gray-800 p-1 rounded-lg relative"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
            cursor: selectMode !== 'none' ? 'crosshair' : 'default',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const x = idx % gridSize;
            const y = Math.floor(idx / gridSize);
            const key = `${x},${y}`;
            const isObstacle = obstacles.has(key);

            const isSourceZone =
              x >= sourceZone.x.min &&
              x <= sourceZone.x.max &&
              y >= sourceZone.y.min &&
              y <= sourceZone.y.max;

            const isDestinationZone =
              x >= destinationZone.x.min &&
              x <= destinationZone.x.max &&
              y >= destinationZone.y.min &&
              y <= destinationZone.y.max;

            return (
              <div
                key={key}
                onClick={() => handleCellClick(x, y, false)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleCellClick(x, y, true);
                }}
                onMouseEnter={() => setHovered({ x, y })}
                onMouseLeave={() => setHovered(null)}
                className={`relative w-5 h-5 transition-colors ${
                  selectMode !== 'none' ? 'cursor-crosshair' : 'cursor-pointer'
                } ${
                  isObstacle
                    ? 'bg-gray-700'
                    : isSourceZone
                    ? 'bg-green-900 hover:bg-green-800'
                    : isDestinationZone
                    ? 'bg-purple-900 hover:bg-purple-800'
                    : 'bg-[#1a1a1a] hover:bg-gray-900'
                }`}
              />
            );
          })}

          {/* Hover preview */}
          {selectMode !== 'none' && hovered && (
            <div
              className="pointer-events-none absolute"
              style={{
                left: `${hovered.x * 21 + 1}px`,
                top: `${hovered.y * 21 + 1}px`,
                width: '20px',
                height: '20px',
                border: `2px solid ${
                  selectMode === 'source' ? '#34D399' : '#A78BFA'
                }`,
                boxSizing: 'border-box',
              }}
            />
          )}

          {/* Trails */}
          {agents.map((agent) => {
            const trail = agentTrails.get(agent.id) || [];
            return trail.map((pos, idx) => {
              const opacity = ((idx + 1) / trail.length) * 0.4;
              return (
                <motion.div
                  key={`${agent.id}-trail-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none rounded-full blur-sm"
                  style={{
                    left: `${pos.x * 21 + 2}px`,
                    top: `${pos.y * 21 + 2}px`,
                    width: '16px',
                    height: '16px',
                    backgroundColor: agent.color,
                  }}
                />
              );
            });
          })}

          {/* Agents */}
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              animate={{
                left: `${agent.x * 21 + 2}px`,
                top: `${agent.y * 21 + 2}px`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="absolute pointer-events-none"
              style={{
                width: '16px',
                height: '16px',
              }}
            >
              <div
                className="absolute inset-0 rounded-full blur-md animate-pulse"
                style={{
                  backgroundColor: agent.color,
                  opacity: 0.6,
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: agent.color,
                  boxShadow: `0 0 10px ${agent.color}, 0 0 20px ${agent.color}`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
