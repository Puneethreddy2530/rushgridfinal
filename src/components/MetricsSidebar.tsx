import { Agent } from '../types/agent';
import { BarChart3, TrendingUp, Zap } from 'lucide-react';

interface MetricsSidebarProps {
  agents: Agent[];
}

export default function MetricsSidebar({ agents }: MetricsSidebarProps) {
  const totalCost = agents.reduce((sum, a) => sum + a.pathCost, 0);
  const totalNodesExplored = agents.reduce((sum, a) => sum + a.nodesExplored, 0);
  const avgSpeed = agents.length > 0 ? (totalCost / agents.length).toFixed(1) : '0';

  const algorithmColors = {
    'A*': '#d50032',
    'Bi-A*': '#3b4cca',
    'Dynamic A*': '#cccccc',
  };

  return (
    <div className="w-80 bg-black border-l border-gray-800 p-4 overflow-y-auto">
      <h2 className="font-display text-xl text-[#d50032] mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Live Metrics
      </h2>

      <div className="space-y-4">
        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <TrendingUp className="w-3 h-3" />
            Total Agents
          </div>
          <div className="text-2xl font-bold text-white">{agents.length}</div>
        </div>

        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Zap className="w-3 h-3" />
            Total Path Cost
          </div>
          <div className="text-2xl font-bold text-white">{totalCost}</div>
        </div>

        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Nodes Explored</div>
          <div className="text-2xl font-bold text-white">{totalNodesExplored}</div>
        </div>

        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Avg Path Length</div>
          <div className="text-2xl font-bold text-white">{avgSpeed}</div>
        </div>

        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
          <div className="text-xs text-gray-400 mb-3">Algorithms Active</div>
          <div className="space-y-2">
            {(['A*', 'Bi-A*', 'Dynamic A*'] as const).map((algo) => {
              const count = agents.filter((a) => a.algorithm === algo).length;
              const color = algorithmColors[algo];
              const percentage = agents.length > 0 ? (count / agents.length) * 100 : 0;

              return (
                <div key={algo} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 0 8px ${color}`,
                        }}
                      />
                      <span style={{ color }}>{algo}</span>
                    </div>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 4px ${color}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual agent details */}
        {agents.length > 0 && (
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
            <div className="text-xs text-gray-400 mb-3">Active Agents</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {agents.map((agent) => (
                <div key={agent.id} className="text-xs border-b border-gray-800 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: agent.color,
                          boxShadow: `0 0 6px ${agent.color}`,
                        }}
                      />
                      <span style={{ color: agent.color }} className="font-mono">
                        {agent.id.slice(6, 12)}
                      </span>
                    </div>
                    <span className="text-gray-500">{agent.algorithm}</span>
                  </div>
                  <div className="text-gray-400 text-[10px] pl-4">
                    Cost: {agent.pathCost} | Explored: {agent.nodesExplored}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}