import type { GridNode, RoadEdge, NodeId } from '../types/pathfuel';

export function makeGrid(n = 20): GridNode[][] {
  const grid: GridNode[][] = [];
  for (let y = 0; y < n; y++) {
    const row: GridNode[] = [];
    for (let x = 0; x < n; x++) {
      row.push({
        id: id(x, y),
        x,
        y,
        blocked: false,
        congestion: 0,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function id(x: number, y: number): NodeId {
  return `${x},${y}`;
}

export function getNode(grid: GridNode[][], x: number, y: number): GridNode | undefined {
  return grid[y]?.[x];
}

export function buildEdges(grid: GridNode[][]): Map<string, RoadEdge[]> {
  const edges = new Map<string, RoadEdge[]>();
  const n = grid.length;

  const neighbors = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const from = grid[y][x];
      const list: RoadEdge[] = [];
      for (const [dx, dy] of neighbors) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
        const to = grid[ny][nx];
        list.push({
          from: from.id,
          to: to.id,
          baseCost: 1,
          weight: 1, // starts as base cost
          congestionLevel: 0,
        });
      }
      edges.set(from.id, list);
    }
  }
  return edges;
}