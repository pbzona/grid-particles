import { Graph } from '../graph';
import { DrawConfig, Position, lerp } from '../lib/utils';
import { Point } from './point';

const SPEED = 5;

export class Particle extends Point {
  private readonly startingPoint: Point;
  private lastPoint: Point;
  private nextPoint: Point;
  private lerpOffset: number;

  private trail: Point[];
  private trailLength: number;

  private ephemeral: boolean;
  private lifetime: number;
  private dead: boolean;

  constructor({ x, y }: Position, graph: Graph, startingPoint?: Point) {
    super({ x, y }, graph);

    this.startingPoint = startingPoint
      ? startingPoint
      : this.graph.points[Math.floor(Math.random() * (this.graph.points.length - 1))];
    this.position = this.startingPoint.position;

    this.lastPoint = this.startingPoint;
    this.nextPoint =
      this.lastPoint.adjacentPoints[
        Math.floor(Math.random() * (this.lastPoint.adjacentPoints.length - 1))
      ];

    this.lerpOffset = 0.0;
    this.trail = [];
    this.trailLength = 60;

    this.ephemeral = true;
    this.lifetime = 300;
    this.dead = false;
  }

  #updatePosition() {
    if (!this.dead) {
      if (this.lerpOffset === 1) {
        this.lastPoint = this.nextPoint;
        this.nextPoint =
          this.lastPoint.adjacentPoints[
            Math.floor(Math.random() * this.lastPoint.adjacentPoints.length)
          ];
        this.lerpOffset = 0;
      }

      const movement = SPEED / 100;
      this.lerpOffset = this.lerpOffset + movement;

      if (this.lerpOffset > 1.0) {
        this.lerpOffset = 1.0;
      }

      this.position = {
        x: Math.round(lerp(this.lastPoint.position.x, this.nextPoint.position.x, this.lerpOffset)),
        y: Math.round(lerp(this.lastPoint.position.y, this.nextPoint.position.y, this.lerpOffset)),
      };

      this.trail.push(new Point({ ...this.position }, this.graph));
    }

    if (this.trail.length > this.trailLength || this.dead) {
      this.trail.shift();
    }

    this.trail.forEach(p => {
      p.opacity = p.opacity - 1 / (this.trailLength + 1);
    });
  }

  draw(ctx: CanvasRenderingContext2D, cfg: DrawConfig) {
    if (this.opacity <= 0) {
      this.graph.removeParticle(this);
    }

    if (this.ephemeral) {
      this.lifetime -= 1;
      if (this.lifetime <= 0) {
        this.dead = true;
      }
    }

    let config = { radius: 3, color: '#4ad' };
    if (cfg) {
      config = { ...config, ...cfg };
    }

    for (let p = 0; p < this.trail.length - 1; p++) {
      this.trail[p].draw(ctx, config, false);
    }

    if (this.dead) {
      this.opacity = Math.max(this.opacity - 1 / this.trailLength, 0);
    }

    const radius = 3;
    ctx.save();
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.fillStyle = config.color;
    ctx.arc(this.position.x, this.position.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();

    this.#updatePosition();
  }
}
