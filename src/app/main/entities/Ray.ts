export class Ray {
  size: number = 5;                   // Size of the line to draw
  colour: string = '#000000';         // Color of the line to draw
  length: number = 60;                // Length of the line to draw
  velocity:number = 15;               // Velocity of the line to draw
  power: number = 20;

  firstX: number;                          // Global reference of the X coordinate to continue drawing
  firstY: number;                          // Global reference of the Y coordinate to continue drawing
  lastX: number;                          // Global reference of the X coordinate to continue drawing
  lastY: number;                          // Global reference of the Y coordinate to continue drawing
}
