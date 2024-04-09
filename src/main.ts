import { Graph } from './graph';
import './style.css';

function getCanvasElement(): HTMLCanvasElement {
  const canvas = document.getElementById('canvas');
  if (!canvas) throw new Error('canvas element missing');

  if (canvas instanceof HTMLCanvasElement) {
    return canvas;
  } else {
    throw new Error('element is not a canvas');
  }
}

const canvas = getCanvasElement();
canvas.width = 800;
canvas.height = 800;

const ctx = canvas.getContext('2d');
if (ctx === null) {
  throw new Error('context is somehow null???');
}

const graph = new Graph(canvas);

function main() {
  if (ctx) {
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    graph.draw(ctx);
  }

  requestAnimationFrame(main);
}

main();
