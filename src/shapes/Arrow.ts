import ShapeBase from './ShapeBase';
import Point from './Point';

/**
 * 箭头
 * 
 * @class Arrow
 * @extends {ShapeBase}
 */
class Arrow extends ShapeBase {
    beginPoint: Point;
    stopPoint: Point;
    range: number

    constructor(beginPoint: Point, stopPoint: Point, range: number, color: string, lineWidth: number = 0) {
        super(color, lineWidth);
        this.beginPoint = beginPoint;
        this.stopPoint = stopPoint;
        this.range = range;
    }
}

export default Arrow;