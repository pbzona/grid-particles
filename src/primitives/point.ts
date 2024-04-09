import { Graph } from '../graph';
import { DrawConfig, Position } from '../lib/utils';

export class Point {
  position: Position;
  opacity: number;
  readonly adjacentPoints: Point[];
  protected readonly graph: Graph;

  constructor({ x, y }: Position, graph: Graph) {
    this.position = { x: x || 0, y: y || 0 };
    this.graph = graph;
    this.adjacentPoints = [];
    this.opacity = 1.0;
  }

  setX(val: number) {
    this.position.x = val;
  }

  setY(val: number) {
    this.position.y = val;
  }

  isLocatedAt(p: Position): boolean {
    return p.x === this.position.x && p.y === this.position.y;
  }

  isAdjacentTo(p: Position): boolean {
    if (this.adjacentPoints.find(point => point.isLocatedAt(p))) {
      return true;
    }

    return (
      (this.position.x === p.x &&
        (this.position.y === p.y + this.graph.cellSize ||
          this.position.y === p.y - this.graph.cellSize)) ||
      (this.position.y === p.y &&
        (this.position.x === p.x + this.graph.cellSize ||
          this.position.x === p.x - this.graph.cellSize))
    );
  }

  addAdjacentPoint(p: Point): void {
    this.adjacentPoints.push(p);
  }

  draw(ctx: CanvasRenderingContext2D, cfg: DrawConfig, includeAdjacent: boolean = false) {
    let config = { radius: 3, color: '#4ad' };
    if (cfg) {
      config = { ...config, ...cfg };
    }

    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.fillStyle = config.color;
    ctx.arc(this.position.x, this.position.y, config.radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset
    ctx.globalAlpha = 1.0;

    if (includeAdjacent) {
      for (const segment of this.graph.segments) {
        if (segment.includes(this)) {
          segment.draw(ctx);
        }
      }
    }
  }
}
