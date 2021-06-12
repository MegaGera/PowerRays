import {Figure} from './Figure';
import {Ray} from './Ray';

export class Circle extends Figure{
  radius: number;

  constructor(x, y, radius) {
    super(x, y);
    this.radius = radius;
  }

  draw(ctx, color) {
    if (this.show) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.font = '25px serif';
      ctx.fillStyle = 'black';
      ctx.fillText(String(this.life), this.x - this.radius, this.y - this.radius - 5);
    }
  }

  collision(ray: Ray): boolean {
    if (ray.lastX < this.x + this.radius && ray.lastX > this.x - this.radius &&
        ray.lastY < this.y + this.radius && ray.lastY > this.y - this.radius) {
      this.life = this.life - ray.power;
      if (this.life <= 0) {
        this.changeShow();
      }
      return true;
    }
    return false;
  }

  changeShow() {
    this.show = !this.show;
  }
}
