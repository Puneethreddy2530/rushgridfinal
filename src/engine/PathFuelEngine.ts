import type { GridNode, RoadEdge, PathResult, Personality, AlgorithmType } from '../types/pathfuel';
import { AStarEngine } from './AStar';
import { DijkstraEngine } from './Dijkstra';
import { BiAStarEngine } from './BiAStar';
import { DynamicAStarEngine } from './DynamicAStar';

/**
 * PathFuel Engine: selects algorithm automatically and exposes metrics
 */
export class PathFuelEngine {
  private grid: GridNode[][];
  private edges: Map<string, RoadEdge[]>;

  constructor(grid: GridNode[][], edges: Map<string, RoadEdge[]>) {
    this.grid = grid;
    this.edges = edges;
  }

  selectAlgorithm(start: GridNode, goal: GridNode, volatile: boolean): AlgorithmType {
    const manhattan = Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
    if (volatile) return 'dynamic-astar';
    if (manhattan > 10) return 'bi-astar';
    return 'astar';
  }

  route(start: GridNode, goal: GridNode, opts?: { personality?: Personality; volatile?: boolean; force?: AlgorithmType }): PathResult {
    const personality = opts?.personality ?? 'balanced';
    const volatile = opts?.volatile ?? false;
    const chosen = opts?.force ?? this.selectAlgorithm(start, goal, volatile);

    switch (chosen) {
      case 'dijkstra':
        return new DijkstraEngine(this.grid, this.edges).findPath(start, goal);
      case 'bi-astar':
        return new BiAStarEngine(this.grid, this.edges).findPath(start, goal, personality);
      case 'dynamic-astar':
        return new DynamicAStarEngine(this.grid, this.edges).findPath(start, goal, personality);
      case 'astar':
      default:
        return new AStarEngine(this.grid, this.edges).findPath(start, goal, personality);
    }
  }
}