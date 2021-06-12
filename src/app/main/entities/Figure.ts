import {Ray} from './Ray';

export class Figure {
  x: number;
  y: number;
  life: number = 100;
  show: boolean = true;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, color) {}

  collision(ray: Ray): boolean {
    return false;
  }

  changeShow() {}

}
