import { Point } from '../primitives/point';

export interface Position {
  x: number;
  y: number;
}

export interface DrawConfig {
  radius?: number;
  color?: string;
}

// Distance from one position to another
export function distance(p1: Position, p2: Position) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Get the closest point to a given position that is also less than "threshold" distance away
export function getNearestPoint(
  pos: Position,
  points: Point[],
  threshold = Number.MAX_SAFE_INTEGER
) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let nearest = null;

  for (const point of points) {
    const d = distance(point.position, pos);
    if (d < minDistance && d < threshold) {
      minDistance = d;
      nearest = point;
    }
  }

  return nearest;
}

// Linear interpolation between two points a & b, at a distance (offset) of t between them
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
