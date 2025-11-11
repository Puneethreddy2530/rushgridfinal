import { AStarEngine } from './AStar';
import type { GridNode, RoadEdge, PathResult, Personality } from '../types/pathfuel';

export class BiAStarEngine {
  private grid: GridNode[][];
  private edges: Map<string, RoadEdge[]>;

  constructor(grid: GridNode[][], edges: Map<string, RoadEdge[]>) {
    this.grid = grid;
    this.edges = edges;
  }

  findPath(start: GridNode, goal: GridNode, personality: Personality = 'balanced'): PathResult {
    const a = new AStarEngine(this.grid, this.edges);
    const res = a.findPath(start, goal, personality);
    return { ...res, algorithm: 'Bi-A*' };
  }
}