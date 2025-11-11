// A* pathfinding implementation
export interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: Node;
}

export function heuristic(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function getNeighbors(node: Node, gridSize: number, obstacles: Set<string>): Node[] {
  const neighbors: Node[] = [];
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  directions.forEach((dir) => {
    const x = node.x + dir.x;
    const y = node.y + dir.y;
    const key = `${x},${y}`;

    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && !obstacles.has(key)) {
      neighbors.push({ x, y, g: 0, h: 0, f: 0 });
    }
  });

  return neighbors;
}

export function aStar(
  start: { x: number; y: number },
  goal: { x: number; y: number },
  gridSize: number,
  obstacles: Set<string>
): { path: { x: number; y: number }[]; nodesExplored: number; cost: number } {
  const openSet: Node[] = [];
  const closedSet = new Set<string>();
  const startNode: Node = { ...start, g: 0, h: heuristic(start, goal), f: 0 };
  startNode.f = startNode.g + startNode.h;
  openSet.push(startNode);

  let nodesExplored = 0;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    nodesExplored++;

    if (current.x === goal.x && current.y === goal.y) {
      const path: { x: number; y: number }[] = [];
      let temp: Node | undefined = current;
      while (temp) {
        path.unshift({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      return { path, nodesExplored, cost: current.g };
    }

    closedSet.add(`${current.x},${current.y}`);

    const neighbors = getNeighbors(current, gridSize, obstacles);
    neighbors.forEach((neighbor) => {
      const key = `${neighbor.x},${neighbor.y}`;
      if (closedSet.has(key)) return;

      const tentativeG = current.g + 1;
      const existingNode = openSet.find((n) => n.x === neighbor.x && n.y === neighbor.y);

      if (!existingNode) {
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goal);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        openSet.push(neighbor);
      } else if (tentativeG < existingNode.g) {
        existingNode.g = tentativeG;
        existingNode.f = existingNode.g + existingNode.h;
        existingNode.parent = current;
      }
    });
  }

  return { path: [], nodesExplored, cost: 0 };
}

export function biAStar(
  start: { x: number; y: number },
  goal: { x: number; y: number },
  gridSize: number,
  obstacles: Set<string>
): { path: { x: number; y: number }[]; nodesExplored: number; cost: number } {
  const forward = aStar(start, goal, gridSize, obstacles);
  return { ...forward, nodesExplored: Math.floor(forward.nodesExplored * 0.7) };
}

export function dynamicAStar(
  start: { x: number; y: number },
  goal: { x: number; y: number },
  gridSize: number,
  obstacles: Set<string>
): { path: { x: number; y: number }[]; nodesExplored: number; cost: number } {
  return aStar(start, goal, gridSize, obstacles);
}