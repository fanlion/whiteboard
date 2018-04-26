import ShapeBase from './ShapeBase';

/**
 * 矩形
 * 
 * @class Rectangle
 * @extends {ShapeBase}
 */
class Rectangle extends ShapeBase {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, radius: number = 0, color: string = '', lineWidth: number = 0) {
    super(color, lineWidth);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
  }
} 

export default Rectangle;