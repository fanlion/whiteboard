/**
 * 形状基础类
 * 
 * @class ShapeBase
 */
class ShapeBase {
     color: string;
     lineWidth: number;
     type: string;

    constructor(color: string = 'black', lineWidth: number = 0, type: string) {
        this.color = color;
        this.lineWidth = lineWidth;
        this.type = type;
    }

}

export default ShapeBase;