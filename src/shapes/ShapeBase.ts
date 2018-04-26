
class ShapeBase {
     color: string;
     lineWidth: number;

    constructor(color: string = 'black', lineWidth: number = 0) {
        this.color = color;
        this.lineWidth = lineWidth;
    }
}

export default ShapeBase;