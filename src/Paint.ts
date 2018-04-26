import Point from './shapes/Point';

/**
 * 绘画逻辑
 * 
 * @class Paint
 */

class Paint {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    static edgeLen: number = 25;
    static angle: number = 15;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    /**
     * 画点
     * 
     * @param {Point[]} points 
     * @param {number} lineWidth 
     * @param {string} color 
     * @memberof Paint
     */
    public drawPoint(points: Point[], lineWidth: number, color: string): void {
        for (let i = 0; i < points.length; i++) {
            this.context.beginPath();
            if (points[i].y && i) {
                this.context.moveTo(points[i - 1].x, points[i - 1].y);
            } else {
                this.context.moveTo(points[i].x - 1, points[i].y);
            }
            this.context.lineWidth = lineWidth;
            this.context.strokeStyle = color;
            this.context.lineTo(points[i].x, points[i].y);
            this.context.closePath();
            this.context.stroke();
        }
    }

    /**
     * 画椭圆
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} a 
     * @param {number} b 
     * @param {number} lineWidth 
     * @param {string} color 
     * @memberof Paint
     */
    public drawEllipse(x: number, y: number, a: number, b: number, lineWidth: number, color: string): void {
        this.context.beginPath();
        this.context.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
        this.context.lineWidth = lineWidth;
        this.context.fillStyle = 'rgba(0, 0, 0, 0)';
        this.context.strokeStyle = color;
        this.context.fill();
        this.context.stroke();
    }

    private createRect(x: number, y: number, width: number, height: number, radius: number, color: string, type: string, lineWidth: number): void {
        this.context.beginPath();
        this.context.moveTo(x, y + radius);
        this.context.lineTo(x, y + height - radius);
        this.context.quadraticCurveTo(x, y + height, x + radius, y + height);
        this.context.lineTo(x + width - radius, y + height);
        this.context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        this.context.lineTo(x + width, y + radius);
        this.context.quadraticCurveTo(x + width, y, x + width - radius, y);
        this.context.lineTo(x + radius, y);
        this.context.quadraticCurveTo(x, y, x, y + radius);
        // @ts-ignore
        this.context[type + 'Style'] = color;
        this.context.lineWidth = lineWidth;
        this.context.closePath();
        // @ts-ignore
        this.context[type]();
    }

    /**
     * 画空心矩形
     * 
     * @private
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} radius 
     * @param {string} color 
     * @param {number} lineWidth 
     * @memberof Paint
     */
     public drawRect(x: number, y: number, width: number, height: number, radius: number, color: string, lineWidth: number): void {
        this.createRect(x, y, width, height, radius, color, 'stroke', lineWidth);
    }

    private arrowCoord(beginPoint: Point, stopPoint: Point, range: number): number[] {
        const polygonVertex: number[] = [];
        polygonVertex[0] = beginPoint.x;
        polygonVertex[1] = beginPoint.y;
        polygonVertex[6] = stopPoint.x;
        polygonVertex[7] = stopPoint.y;
        // 获取弧度
        const angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
        polygonVertex[8] = stopPoint.x - Paint.edgeLen * Math.cos(Math.PI / 180 * (angle + range));
        polygonVertex[9] = stopPoint.y - Paint.edgeLen * Math.sin(Math.PI / 180 * (angle + range));
        polygonVertex[4] = stopPoint.x - Paint.edgeLen * Math.cos(Math.PI / 180 * (angle - range));
        polygonVertex[5] = stopPoint.y - Paint.edgeLen * Math.sin(Math.PI / 180 * (angle - range));

        return polygonVertex;
    }

    private sideCoord(polygonVertex: number[]): void {
        const x = (polygonVertex[4] + polygonVertex[8]) / 2;
        const y = (polygonVertex[5] + polygonVertex[9]) / 2;
        const midPoint: Point = new Point(x, y);
        polygonVertex[2] = (polygonVertex[4] + midPoint.x) / 2;
        polygonVertex[3] = (polygonVertex[5] + midPoint.y) / 2;
        polygonVertex[10] = (polygonVertex[8] + midPoint.x) / 2;
        polygonVertex[11] = (polygonVertex[9] + midPoint.y) / 2;
    }

    /**
     * 画箭头
     * 
     * @param {Point} beginPoint 
     * @param {Point} stopPoint 
     * @param {string} color 
     * @param {number} range 
     * @memberof Paint
     */
    public drawArrow(beginPoint: Point, stopPoint: Point, color: string, range: number, ): void {
        const polygonVertex = this.arrowCoord(beginPoint, stopPoint, range);
        this.sideCoord(polygonVertex);

        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(polygonVertex[0], polygonVertex[1]);
        this.context.lineTo(polygonVertex[2], polygonVertex[3]);
        this.context.lineTo(polygonVertex[4], polygonVertex[5]);
        this.context.lineTo(polygonVertex[6], polygonVertex[7]);
        this.context.lineTo(polygonVertex[8], polygonVertex[9]);
        this.context.lineTo(polygonVertex[10], polygonVertex[11]);
        this.context.closePath();
        this.context.fill();
    }

    /**
     * 绘制直线
     * 
     * @param {Point} beginPoint 
     * @param {Point} stopPoint 
     * @param {string} color 
     * @param {number} lineWidth 
     * @memberof Paint
     */
    public drawLine(beginPoint: Point, stopPoint: Point, color: string, lineWidth: number): void {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth;
        this.context.moveTo(beginPoint.x, beginPoint.y);
        this.context.lineTo(stopPoint.x, stopPoint.y);
        this.context.closePath();
        this.context.stroke();
    }

    /**
     * 画三角形
     * 
     * @param {Point} top 
     * @param {Point} left 
     * @param {Point} right 
     * @param {string} color 
     * @param {number} lineWidth 
     * @memberof Paint
     */
    public drawTriangle(top: Point, left: Point, right: Point, color: string, lineWidth: number): void {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth;
        this.context.moveTo(top.x, top.y);
        this.context.lineTo(right.x, right.y);
        this.context.lineTo(left.x, left.y);
        this.context.closePath();
    }

    public drawTriangle2(beginPoint: Point, stopPoint: Point): void {
    }


    /**
     * 清空画板
     * 
     * @memberof Paint
     */
    public clean(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Paint;