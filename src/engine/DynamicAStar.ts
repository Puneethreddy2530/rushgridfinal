import { AStarEngine } from './AStar';
import type { GridNode, RoadEdge, PathResult, Personality } from '../types/pathfuel';

export class DynamicAStarEngine {
  private grid: GridNode[][];
  private edges: Map<string, RoadEdge[]>;

  constructor(grid: GridNode[][], edges: Map<string, RoadEdge[]>) {
    this.grid = grid;
    this.edges = edges;
  }

  updateEdgeWeight(fromId: string, toId: string, newWeight: number, newCongestionLevel?: number) {
    const list = this.edges.get(fromId);
    if (!list) return;
    const edge = list.find((e) => e.to === toId);
    if (!edge) return;
    edge.weight = newWeight;
    if (typeof newCongestionLevel === 'number') edge.congestionLevel = newCongestionLevel;
  }

  findPath(start: GridNode, goal: GridNode, personality: Personality = 'balanced'): PathResult {
    const a = new AStarEngine(this.grid, this.edges);
    const res = a.findPath(start, goal, personality);
    return { ...res, algorithm: 'Dynamic A*' };
  }
}