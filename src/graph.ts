import { getNearestPoint } from './lib/utils';
import { Particle } from './primitives/particle';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';

const hoverThreshold = 30;

export class Graph {
  private canvas: HTMLCanvasElement;
  readonly points: Point[];
  readonly segments: Segment[];
  protected particles: Particle[];
  readonly cellSize: number;
  private boundMouseMove?: (event: MouseEvent) => void;
  private boundMouseDown?: (event: MouseEvent) => void;
  private hovered?: Point;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.cellSize = 40;
    this.hovered = undefined;

    this.points = this.#initializePoints();
    this.segments = this.#initializeSegments();
    this.particles = this.#initializeParticles();

    this.#addEventListeners();
  }

  #initializePoints() {
    const rows = this.canvas.width / this.cellSize + 1;
    const cols = this.canvas.height / this.cellSize + 1;

    const startingX = 0 - this.cellSize / 2;
    const startingY = 0 - this.cellSize / 2;

    let points: Point[] = [];

    for (let y = startingY; y < rows * this.cellSize; y += this.cellSize) {
      for (let x = startingX; x < cols * this.cellSize; x += this.cellSize) {
        //@ts-ignore
        points.push(new Point({ x, y }, this));
      }
    }

    return points;
  }

  #initializeSegments() {
    let segments: Segment[] = [];

    this.points.forEach(point => {
      this.points.forEach(p => {
        if (point.isLocatedAt(p.position)) {
          return;
        }

        if (point.isAdjacentTo(p.position)) {
          const segment = new Segment(point, p);
          const duplicates = segments.some(s => segment.isEquivalent(s));

          if (!duplicates) {
            segments.push(segment);
          }

          point.addAdjacentPoint(p);
        }
      });
    });

    return segments;
  }

  #initializeParticles() {
    // const particle = new Particle({ x: 0, y: 0 }, this);
    // return [particle];
    return [];
  }

  #addEventListeners() {
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
    this.canvas.addEventListener('mousedown', this.boundMouseDown);
  }

  #handleMouseMove(event: MouseEvent) {
    const mousePos = { x: event.offsetX, y: event.offsetY };
    const nearest = getNearestPoint(mousePos, this.points, hoverThreshold);
    this.hovered = nearest ? nearest : undefined;
  }

  #handleMouseDown(event: MouseEvent) {
    // Left click
    if (event.button === 0) {
      const mousePos = { x: event.offsetX, y: event.offsetY };
      const nearest = getNearestPoint(mousePos, this.points, hoverThreshold);
      if (nearest) {
        // Number of particles to generate on click
        const count = 40;
        for (let i = 0; i < count; i++) {
          this.particles.push(new Particle({ x: 0, y: 0 }, this, nearest));
        }
      }
    }
  }

  removeParticle(p: Particle) {
    this.particles = this.particles.filter(particle => particle !== p);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // this.points.forEach(point => point.draw(ctx, { radius: 2, color: '#444' }));
    this.particles.forEach(point => point.draw(ctx, {}));

    if (this.hovered) {
      this.hovered.draw(ctx, { radius: 5 }, false);
    }

    // for (let point of this.points) {
    //   point.draw(ctx);
    // }

    // for (let seg of this.segments) {
    //   seg.draw(ctx);
    // }
  }
}
