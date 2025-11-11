// Unify simulation types and avoid DOM name collisions (Node) by using GridNode.

export type NodeId = string;

export interface GridNode {
  id: NodeId;
  x: number;
  y: number;
  blocked: boolean;
  congestion: number; // 0..1
}

export interface RoadEdge {
  from: NodeId;
  to: NodeId;
  weight: number; // dynamic weight (baseCost * congestion factor)
  baseCost: number;
  congestionLevel: number; // 0..1
}

export type Personality = 'aggressive' | 'cautious' | 'balanced';

export interface Agent {
  id: string;
  position: GridNode;
  destination: GridNode;
  path: GridNode[];
  personality: Personality;
  isEmergency: boolean;
  speed: number;
  score: number; // rerouting efficiency score
}

export interface PathResult {
  path: GridNode[];
  cost: number;
  nodesExplored: number;
  executionTime: number;
  algorithm: 'A*' | 'Bi-A*' | 'Dynamic A*' | 'Dijkstra';
}

export type AlgorithmType = 'astar' | 'bi-astar' | 'dynamic-astar' | 'dijkstra';