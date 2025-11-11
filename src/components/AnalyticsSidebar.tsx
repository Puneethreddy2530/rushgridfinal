import { TrendingUp, Clock, AlertCircle, Leaf, Trophy, BarChart3 } from 'lucide-react';

export default function AnalyticsSidebar() {
  return (
    <div className="w-80 bg-bg-primary border-l border-border-default p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="font-display text-2xl text-accent-red mb-6">Analytics</h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-accent-red" />
            <span className="text-xs text-text-secondary">Total Reroutes</span>
          </div>
          <div className="text-2xl font-bold">1,247</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-accent-blue" />
            <span className="text-xs text-text-secondary">Avg Speed</span>
          </div>
          <div className="text-2xl font-bold">45 km/h</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-accent-red" />
            <span className="text-xs text-text-secondary">Congestion %</span>
          </div>
          <div className="text-2xl font-bold">23%</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-accent-green" />
            <span className="text-xs text-text-secondary">Emissions Saved</span>
          </div>
          <div className="text-2xl font-bold">0.8kg</div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-display text-lg mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent-red" />
          Top Performers
        </h3>
        <div className="space-y-3">
          {[
            { rank: '#1', name: 'Agent-1', type: 'balanced', score: '100%', reroutes: '0 reroutes' },
            { rank: '#2', name: 'Agent-1', type: 'cautious', score: '100%', reroutes: '0 reroutes' },
            { rank: '#3', name: 'Agent-1', type: 'balanced', score: '100%', reroutes: '0 reroutes' },
          ].map((agent, i) => (
            <div key={i} className="border-b border-border-default pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-accent-red">{agent.rank}</span>
                  <div className="w-3 h-3 bg-accent-red rounded-full"></div>
                  <span className="text-sm">{agent.name}</span>
                  <span className="text-xs text-text-muted">{agent.type}</span>
                </div>
                <span className="text-accent-green text-sm">{agent.score}</span>
              </div>
              <div className="text-xs text-text-muted ml-8">{agent.reroutes}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithms Used */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-display text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-purple" />
          Algorithms Used
        </h3>
        <div className="space-y-3">
          {[
            { name: 'A*', count: 1 },
            { name: 'Bi-A*', count: 2 },
            { name: 'Dynamic A*', count: 0 },
          ].map((algo, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-20 text-sm">{algo.name}</span>
              <div className="flex-1 bg-bg-card rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent-red h-full"
                  style={{ width: `${algo.count * 30}%` }}
                />
              </div>
              <span className="text-sm text-text-secondary w-6">{algo.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Efficiency Score */}
      <div className="glass-card p-4">
        <h3 className="font-display text-lg mb-4">Efficiency Score</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent-red mb-2">85%</div>
          <div className="w-20 h-20 mx-auto">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0a0a0a" strokeWidth="2" />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="#d50032"
                strokeWidth="2"
                strokeDasharray="85 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}