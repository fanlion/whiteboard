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
}

export default Curve;