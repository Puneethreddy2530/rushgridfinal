export type Algorithm = 'A*' | 'Bi-A*' | 'Dynamic A*';

export interface Agent {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  path: { x: number; y: number }[];
  algorithm: Algorithm;
  isEmergency: boolean;
  color: string;
  pathCost: number;
  nodesExplored: number;
  startTime: number;
}