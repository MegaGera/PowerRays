import {Figure} from './Figure';
import {Ray} from './Ray';

export class Wall extends Figure {

  x2: number;
  y2: number;

  constructor(x, y, x2, y2) {
    super(x, y);
    this.x2 = x2;
    this.y2 = y2;
  }

  draw(ctx, color) {
    if (this.show) {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.x2, this.y2);
    }
  }

  collision(ray: Ray): boolean {
    if (ray.lastX < this.x + this.x2 && ray.lastX > this.x &&
        ray.lastY < this.y + this.y2 && ray.lastY > this.y) {
      return true;
    }
    return false;
  }
}
