import { Point } from './point';

export class Segment {
  readonly p1: Point;
  readonly p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  isEquivalent(seg: Segment): boolean {
    return (
      (seg.p1.isLocatedAt(this.p1.position) && seg.p2.isLocatedAt(this.p2.position)) ||
      (seg.p1.isLocatedAt(this.p2.position) && seg.p2.isLocatedAt(this.p1.position))
    );
  }

  includes(p: Point): boolean {
    return p.isLocatedAt(this.p1.position) || p.isLocatedAt(this.p2.position);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.moveTo(this.p1.position.x, this.p1.position.y);
    ctx.lineTo(this.p2.position.x, this.p2.position.y);
    ctx.stroke();
  }
}
