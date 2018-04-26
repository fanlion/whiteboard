import ShapeBase from './ShapeBase';
import Point from './Point'; 

/**
 * 曲线(自由划线)
 * 
 * @class Curve
 * @extends {ShapeBase}
 */
class Curve extends ShapeBase {
    points: Point[];

    constructor(points: Point[], color: string, lineWidth: number) {
        super(color, lineWidth);
        this.points = points;
    }
}

export default Curve;