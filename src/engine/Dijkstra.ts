import type { GridNode, RoadEdge, PathResult } from '../types/pathfuel';

/**
 * Dijkstra baseline
 */
export class DijkstraEngine {
  private grid: GridNode[][];
  private edges: Map<string, RoadEdge[]>;

  constructor(grid: GridNode[][], edges: Map<string, RoadEdge[]>) {
    this.grid = grid;
    this.edges = edges;
  }

  findPath(start: GridNode, goal: GridNode): PathResult {
    const startTime = performance.now();

    const dist = new Map<string, number>();
    const prev = new Map<string, string>();
    const unvisited = new Set<string>();

    let nodesExplored = 0;

    for (const row of this.grid) {
      for (const node of row) {
        dist.set(node.id, Infinity);
        unvisited.add(node.id);
      }
    }
    dist.set(start.id, 0);

    while (unvisited.size > 0) {
      let current: string | undefined;
      let min = Infinity;

      for (const id of unvisited) {
        const d = dist.get(id) ?? Infinity;
        if (d < min) {
          min = d;
          current = id;
        }
      }
      if (!current || min === Infinity) break;

      nodesExplored++;
      unvisited.delete(current);

      if (current === goal.id) {
        const path = this.reconstruct(prev, current);
        const executionTime = performance.now() - startTime;
        return {
          path,
          cost: dist.get(current) ?? 0,
          nodesExplored,
          executionTime,
          algorithm: 'Dijkstra',
        };
      }

      const neighbors = this.edges.get(current) ?? [];
      for (const edge of neighbors) {
        if (!unvisited.has(edge.to)) continue;
        const alt = (dist.get(current) ?? 0) + edge.weight;
        if (alt < (dist.get(edge.to) ?? Infinity)) {
          dist.set(edge.to, alt);
          prev.set(edge.to, current);
        }
      }
    }

    const executionTime = performance.now() - startTime;
    return { path: [], cost: Infinity, nodesExplored, executionTime, algorithm: 'Dijkstra' };
  }

  private reconstruct(prev: Map<string, string>, current: string): GridNode[] {
    const path: GridNode[] = [];
    let cur: string | undefined = current;
    while (cur) {
      const node = this.getNodeById(cur);
      if (node) path.unshift(node);
      cur = prev.get(cur);
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