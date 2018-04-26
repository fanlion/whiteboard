import ShapeBase from './ShapeBase';
import Point from './Point';


/**
 * 三角形
 * 
 * @class Triangle
 * @extends {ShapeBase}
 */
class Triangle extends ShapeBase {
    topPoint: Point;
    leftPoint: Point;
    rightPoint: Point;

    constructor(top: Point = new Point(), left: Point = new Point(), right: Point = new Point(), color: string = '', lineWidth: number = 0) {
        super(color, lineWidth);
        this.topPoint = top;
        this.leftPoint = left;
        this.rightPoint = right;
    }
}

export default Triangle;