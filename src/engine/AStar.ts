import type { GridNode, RoadEdge, PathResult, Personality } from '../types/pathfuel';

/**
 * A* Pathfinding Algorithm (Manhattan heuristic)
 */
export class AStarEngine {
  private grid: GridNode[][];
  private edges: Map<string, RoadEdge[]>;

  constructor(grid: GridNode[][], edges: Map<string, RoadEdge[]>) {
    this.grid = grid;
    this.edges = edges;
  }

  private heuristic(a: GridNode, b: GridNode): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  findPath(start: GridNode, goal: GridNode, personality: Personality = 'balanced'): PathResult {
    const startTime = performance.now();

    const openSet = new Set<string>([start.id]);
    const cameFrom = new Map<string, string>();

    const gScore = new Map<string, number>();
    gScore.set(start.id, 0);

    const fScore = new Map<string, number>();
    fScore.set(start.id, this.heuristic(start, goal));

    let nodesExplored = 0;

    while (openSet.size > 0) {
      let current = Array.from(openSet).reduce((lowest, nodeId) => {
        const currentF = fScore.get(nodeId) ?? Infinity;
        const lowestF = fScore.get(lowest) ?? Infinity;
        return currentF < lowestF ? nodeId : lowest;
      });

      nodesExplored++;

      if (current === goal.id) {
        const path = this.reconstructPath(cameFrom, current);
        const executionTime = performance.now() - startTime;

        return {
          path,
          cost: gScore.get(current) ?? 0,
          nodesExplored,
          executionTime,
          algorithm: 'A*',
        };
      }

      openSet.delete(current);

      const neighbors = this.edges.get(current) ?? [];
      for (const edge of neighbors) {
        const neighbor = edge.to;
        const neighborNode = this.getNodeById(neighbor);
        if (!neighborNode || neighborNode.blocked) continue;

        const modifier = this.getPersonalityModifier(personality, edge.congestionLevel);
        const tentativeG = (gScore.get(current) ?? 0) + edge.weight * modifier;

        if (tentativeG < (gScore.get(neighbor) ?? Infinity)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeG);
          fScore.set(neighbor, tentativeG + this.heuristic(neighborNode, goal));

          if (!openSet.has(neighbor)) openSet.add(neighbor);
        }
      }
    }

    const executionTime = performance.now() - startTime;
    return {
      path: [],
      cost: Infinity,
      nodesExplored,
      executionTime,
      algorithm: 'A*',
    };
  }

  private getPersonalityModifier(personality: Personality, congestion: number): number {
    switch (personality) {
      case 'aggressive':
        return 1.0 + congestion * 0.5;
      case 'cautious':
        return 1.0 + congestion * 2.0;
      case 'balanced':
      default:
        return 1.0 + congestion;
    }
  }

  private reconstructPath(cameFrom: Map<string, string>, current: string): GridNode[] {
    const path: GridNode[] = [];
    let cur: string | undefined = current;

    while (cur) {
      const node = this.getNodeById(cur);
      if (node) path.unshift(node);
      cur = cameFrom.get(cur);
    }
    return path;
    }

  private getNodeById(id: string): GridNode | undefined {
    for (const row of this.grid) {
      for (const node of row) {
        if (node.id === id) return node;
      }
    }
    return undefined;
  }
}