  import {Component, AfterViewInit, ViewChild, Renderer2} from '@angular/core';
  import {Platform} from '@ionic/angular';
  import {Circle} from './entities/Circle';
  import {Wall} from './entities/Wall';
  import {Figure} from './entities/Figure';
  import {Ray} from './entities/Ray';

  @Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
  })
  export class MainPage implements AfterViewInit {
    @ViewChild('draw', {static: false}) public canvasD: any;  // Reference to the canvasDraw object of the HTML
    public canvasDraw: any;              // Canvas element to interact
    ctxDraw;

    @ViewChild('field', {static: false}) public canvasF: any;  // Reference to the canvasDraw object of the HTML
    public canvasField: any;              // Canvas element to interact
    ctxBackground;

    @ViewChild('background', {static: false}) public canvasB: any;  // Reference to the canvasDraw object of the HTML
    public canvasBackground: any;              // Canvas element to interact
    ctxField;

    ray: Ray;
    figures: Figure[] = [];

    shots: number;

    constructor(private platform: Platform, private renderer: Renderer2) {
    }

    ngAfterViewInit() {
      this.prepareCanvasBackground();
      this.prepareCanvasField();
      this.prepareCanvasDraw();
      this.startGame();
    }

    prepareCanvasBackground() {
      this.canvasBackground = this.canvasB.nativeElement;  // Set the canvas reference

      this.renderer.setAttribute(this.canvasBackground, 'width', String(this.platform.width()));
      this.renderer.setAttribute(this.canvasBackground, 'height', String(this.platform.height() * 0.9));

      this.ctxBackground = this.canvasBackground.getContext('2d');
      this.ctxBackground.fillStyle = '#3bb9eb';
      this.ctxBackground.fillRect(0, 0, this.canvasBackground.width, this.canvasBackground.height);

      this.ctxBackground.fillStyle = "#f91929";
      this.ctxBackground.fillRect(0, this.platform.height() * 0.6,
          this.platform.width(), this.platform.height() - (this.platform.height()) * 0.6);
    }

    prepareCanvasField() {
      this.canvasField = this.canvasF.nativeElement;  // Set the canvas reference
      this.renderer.setAttribute(this.canvasField, 'width', String(this.platform.width()));
      this.renderer.setAttribute(this.canvasField, 'height', String(this.platform.height() * 0.9));

      this.ctxField = this.canvasField.getContext('2d');
    }

    prepareCanvasDraw() {
      this.canvasDraw = this.canvasD.nativeElement;  // Set the canvas reference
      this.renderer.setAttribute(this.canvasDraw, 'width', String(this.platform.width()));
      this.renderer.setAttribute(this.canvasDraw, 'height', String(this.platform.height() * 0.9));

      this.ctxDraw = this.canvasDraw.getContext('2d');  // Reference to draw
    }

    startGame() {
      this.figures = [];
      this.figures.push(new Circle(100, 80, 20));
      this.figures.push(new Circle(this.platform.width() - 100, 80, 20));
      this.figures.push(new Wall(120, 200, 60, 40));
      this.paintField();
      this.shots = 20;
    }

    start(ev) {
      this.ray = new Ray();
      const canvasPosition = this.canvasDraw.getBoundingClientRect();
      this.ray.firstX = ev.touches[0].pageX - canvasPosition.x;    // Get the X start touch
      this.ray.firstY = ev.touches[0].pageY - canvasPosition.y;    // Get the Y start touch
    }

    move(ev) {
      const canvasPosition = this.canvasDraw.getBoundingClientRect();
      const currentX = ev.touches[0].pageX - canvasPosition.x;   // Get the X position touch
      const currentY = ev.touches[0].pageY - canvasPosition.y;   // Get the Y position touch
      this.ray.lastX = currentX;
      this.ray.lastY = currentY;
    }

    end() {
      if (this.ray.lastY < this.ray.firstY && this.shots > 0 && this.ray.firstY >
          this.platform.height() * 0.6) {
        this.shots--;
        window.requestAnimationFrame(this.drawLine.bind(this, this.ray));
      }
    }

    drawLine = (ray: Ray) =>  {
      this.clearLineAnimation(ray);
      this.ctxDraw.beginPath();
      this.ctxDraw.moveTo(ray.firstX, ray.firstY);
      this.ctxDraw.strokeStyle = ray.colour;
      this.ctxDraw.lineWidth = ray.size;
      this.ctxDraw.lineJoin = 'round';
      this.adjustLine(ray);
      this.ctxDraw.lineTo(ray.lastX, ray.lastY);
      this.ctxDraw.closePath();
      this.ctxDraw.stroke();
      if (!this.collision(ray) && this.insideScreen(ray)) {
        window.requestAnimationFrame(this.drawLine.bind(this, ray));
      } else {
        this.paintField();
        this.clearLineAnimation(ray);
      }
    }

    adjustLine(ray: Ray) {
      const x = ray.lastX - ray.firstX;
      const y = ray.lastY - ray.firstY;
      const h = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      ray.lastX = (ray.length * (x / h)) + ray.firstX;
      ray.lastY = (ray.length * (y / h)) + ray.firstY;
      ray.firstX += (ray.velocity * (x / h));
      ray.firstY += (ray.velocity * (y / h));
    }

    collision(ray: Ray) {
      let collision = false;
      for (let figure of this.figures) {
        if (figure.collision(ray)) {
          collision = true;
        }
      }
      return collision;
    }

    insideScreen(ray: Ray) {
      return ray.lastX > 0 && ray.lastX < this.canvasDraw.width &&
          ray.lastY > 0 && ray.lastY < this.canvasDraw.height;
    }


    clearLineAnimation(ray: Ray) {
      if (ray.lastX > ray.firstX) {
        this.ctxDraw.clearRect(ray.firstX - 20, ray.lastY - 10,
            (ray.lastX - ray.firstX) + 30, (ray.firstY - ray.lastY) + 30);
      } else {
        this.ctxDraw.clearRect(ray.lastX - 10, ray.lastY - 10,
            (ray.firstX - ray.lastX) + 30, (ray.firstY - ray.lastY) + 30);
      }
      /*let tmp, half_size = ray.size / 2, PI15 = 1.5 * Math.PI, PI05 = 0.5 * Math.PI,
      lastX = ray.lastX + 1, lastY = ray.lastY + 1, firstX = ray.firstX - 1, firstY = ray.firstY - 1;
      if (lastX > firstX) {
        tmp = lastX; lastX = firstX; firstX = tmp;
        tmp = lastY; lastY = firstY; firstY = tmp;
      }
      this.ctxDraw.save();
      this.ctxDraw.translate(lastX, lastY);
      this.ctxDraw.rotate(Math.atan2(firstY - lastY, firstX - lastX));
      lastX = 0;
      lastY = 0;
      firstX = ray.length - 1;
      firstY = 0;
      this.ctxDraw.moveTo(lastX, lastY - half_size);
      this.ctxDraw.lineTo(firstX, firstY - half_size);
      this.ctxDraw.arc(firstX, firstY, half_size, PI15, PI05, false);
      this.ctxDraw.lineTo(lastX, lastY - half_size + ray.size);
      this.ctxDraw.arc(lastX, lastY, half_size, PI15, PI05, false);
      this.ctxDraw.closePath();
      lastX -= half_size;
      lastY -= half_size;

      this.ctxDraw.clip();
      this.ctxDraw.clearRect(lastX, lastY, ray.length + ray.size, ray.size);
      this.ctxDraw.restore();*/
    }

    clearDraw() {
      this.ctxDraw.clearRect(0, 0, this.canvasDraw.width, this.canvasDraw.height);
    }

    clearField() {
      this.ctxField.clearRect(0, 0, this.canvasField.width, this.canvasField.height);
    }

    paintField() {
      this.clearField();
      let figuresAux = this.figures;
      this.figures = [];

      for (let figure of figuresAux) {
        if (figure.show) {
          this.figures.push(figure);
          figure.draw(this.ctxField, '#138a0c');
        }
      }

    }

  }

