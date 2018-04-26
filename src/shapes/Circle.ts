import ShapeBase from './ShapeBase';
import { ShapeType } from './Types';

/**
 * 圆
 * 
 * @class Circle
 * @extends {ShapeBase}
 */
class Circle extends ShapeBase {
    x: number;
    y: number;
    a: number;
    b: number;

    constructor(x: number, y: number, a: number, b: number, color: string, lineWidth: number) {
      super(color, lineWidth, ShapeType.Circle);
      this.x = x;
      this.y = y;
      this.a = a;
      this.b = b;
    }
}

export default Circle;