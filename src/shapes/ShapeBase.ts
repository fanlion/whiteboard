
class ShapeBase {
    private color: string;
    private lineWidth: number;

    constructor(color: string = 'black', lineWidth: number = 0) {
        this.color = color;
        this.lineWidth = lineWidth;
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public getColor(): string {
        return this.color;
    }

    public setLineWidth(lineWidth: number): void {
        this.lineWidth = lineWidth;
    }

    public getLineWidth(): number {
        return this.lineWidth;
    }
}

export default ShapeBase;