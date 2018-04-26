import ShapeBase from './ShapeBase';
import Point from './Point';
import { ShapeType } from './Types';

/**
 * 直线
 * 
 * @class Line
 * @extends {ShapeBase}
 */
class Line extends ShapeBase{
    begin: Point;
    end: Point;

    constructor(begin: Point, end: Point, color: string, lineWidth: number) {
        super(color, lineWidth, ShapeType.Line);
        this.begin = begin;
        this.end = end;
    }
}

export default Line;