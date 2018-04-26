export var isDebug = false;
export var version = '1.0.0';

import Paint from './Paint';
import Point from './shapes/Point';
import Circle from './shapes/Circle';
import Rectangle from './shapes/Rectangle';
import Curve from './shapes/Curve';
import Arrow from './shapes/Arrow';
import ShapeBase from './shapes/ShapeBase';
import Line from './shapes/Line';

interface Options {
    canvas: HTMLCanvasElement,
    color?: string,
    lineWidth?: number,
    radius?: number,
    shape?: string
}

/**
 * YMPaint
 * 
 * @export
 * @class YMPaint
 */
export class YMPaint {
    private canvas: HTMLCanvasElement;
    private paint: Paint;

    private color: string;      // 画笔颜色
    private lineWidth: number;
    private shape: string;
    private radius: number;

    private drawing: boolean;  // 当前是否正在绘画

    private points: Point[];
    private beginPoint: Point;
    private stopPoint: Point;
    private rect: Rectangle;

    private angle: number;
    private range: number;

    private history: ShapeBase[]

    constructor(config: Options) {
        this.canvas = config.canvas;
        this.paint = new Paint(this.canvas);
        this.color = config.color || 'black';
        this.lineWidth = config.lineWidth || 2;
        this.radius = config.radius || 0;
        this.shape = config.shape || 'line';

        this.angle = 0;
        this.range = 25;

        this.points = [];

        this.beginPoint = new Point();
        this.stopPoint = new Point();

        this.rect = new Rectangle();
        this.history = [];

        // 绑定事件
        this.bindEvent();
    }

    /**
     * 鼠标mousedown事件处理器
     * 
     * @private
     * @param {MouseEvent} e 
     * @memberof YMPaint
     */
    private handleMouseDown(e: MouseEvent): void {
        const x = e.clientX;
        const y = e.clientY;
        this.drawing = true;
        if (this.shape === 'rect') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        } else if (this.shape === 'curve') {
            this.points.push(new Point(x, y));
            this.paint.drawPoint(this.points, this.lineWidth, this.color);
        } else if (this.shape === 'circle') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        } else if (this.shape === 'arrow') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        } else if (this.shape === 'line') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        }
    }

    /**
     * 鼠标mousemove事件处理器
     * 
     * @private
     * @param {MouseEvent} e 
     * @memberof YMPaint
     */
    private handleMouseMove(e: MouseEvent): void {
        if (this.drawing) {
            if (this.shape === 'rect') {
                this.rect.width = Math.abs(this.beginPoint.x - e.clientX);
                this.rect.height = Math.abs(this.beginPoint.y - e.clientY);
                // 确定正确的矩形左上角坐标
                if (this.beginPoint.x > e.clientX) {
                    this.rect.x = e.clientX;
                } else {
                    this.rect.x = this.beginPoint.x;
                }
                if (this.beginPoint.y > e.clientY) {
                    this.rect.y = e.clientY;
                } else {
                    this.rect.y = this.beginPoint.y;
                }
                this.paint.clean();
                this.redrawAll();
                this.paint.drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height, this.radius, this.color, this.lineWidth);
            } else if (this.shape === 'curve') {
                this.points.push(new Point(e.clientX, e.clientY));
                this.paint.drawPoint(this.points, this.lineWidth, this.color);
            } else if (this.shape === 'circle') {
                let pointX = 0, pointY = 0;
                if (this.beginPoint.x > e.clientX) {
                    pointX = this.beginPoint.x - Math.abs(this.beginPoint.x - e.clientX) / 2;
                } else {
                    pointX = Math.abs(this.beginPoint.x - e.clientX) / 2 + this.beginPoint.x;
                }

                if (this.beginPoint.y > e.clientY) {
                    pointY = this.beginPoint.y - Math.abs(this.beginPoint.y - e.clientY) / 2;
                } else {
                    pointY = Math.abs(this.beginPoint.y - e.clientY) / 2 + this.beginPoint.y;
                }
                let lineX = Math.abs(this.beginPoint.x - e.clientX) / 2;
                let lineY = Math.abs(this.beginPoint.y - e.clientY) / 2;
                this.paint.clean();
                this.redrawAll();
                this.paint.drawEllipse(pointX, pointY, lineX, lineY, this.lineWidth, this.color);
            } else if (this.shape === 'arrow') {
                this.stopPoint.x = e.clientX;
                this.stopPoint.y = e.clientY;
                this.paint.clean();
                this.redrawAll();
                this.paint.drawArrow(this.beginPoint, this.stopPoint, this.color, this.range)
            } else if (this.shape === 'line') {
                const stopPoint = new Point(e.clientX, e.clientY);
                this.paint.clean();
                this.redrawAll();
                this.paint.drawLine(this.beginPoint, stopPoint, this.color, this.lineWidth);
            }
        }
    }

    /**
     * 鼠标mouseup事件处理器
     * 
     * @private
     * @param {MouseEvent} e 
     * @memberof YMPaint
     */
    private handleMouseUp(e: MouseEvent): void {
        if (this.shape === 'rect') {
            const rect = new Rectangle(this.rect.x, this.rect.y, this.rect.width, this.rect.height, this.radius, this.color, this.lineWidth);
            this.rect = new Rectangle();
            this.history.push(rect);
        } else if (this.shape === 'curve') {
            const curve = new Curve(this.points, this.color, this.lineWidth);
            this.history.push(curve);
            this.points = [];
        } else if (this.shape === 'circle') {
            let pointX = 0, pointY = 0;
            if (this.beginPoint.x > e.clientX) {
                pointX = this.beginPoint.x - Math.abs(this.beginPoint.x - e.clientX) / 2;
            } else {
                pointX = Math.abs(this.beginPoint.x - e.clientX) / 2 + this.beginPoint.x;
            }

            if (this.beginPoint.y > e.clientY) {
                pointY = this.beginPoint.y - Math.abs(this.beginPoint.y - e.clientY) / 2;
            } else {
                pointY = Math.abs(this.beginPoint.y - e.clientY) / 2 + this.beginPoint.y;
            }
            const lineX = Math.abs(this.beginPoint.x - e.clientX) / 2;
            const lineY = Math.abs(this.beginPoint.y - e.clientY) / 2;
            const circle = new Circle(pointX, pointY, lineX, lineY, this.color, this.lineWidth);

            this.history.push(circle);
            this.beginPoint = new Point();
        } else if (this.shape === 'arrow') {
            const arrow = new Arrow(this.beginPoint, new Point(e.clientX, e.clientY), this.range, this.color, this.lineWidth);
            this.history.push(arrow);
            this.beginPoint = new Point();
        } else if (this.shape === 'line') {
            const stopPoint = new Point(e.clientX, e.clientY);
            const line = new Line(this.beginPoint, stopPoint, this.color, this.lineWidth);
            this.history.push(line);
            this.beginPoint = new Point();
        }
        this.drawing = false;
    }

    /**
     * 绑定事件
     * 
     * @private
     * @memberof YMPaint
     */
    private bindEvent(): void {
        // 给canvas绑定事件
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.canvas.addEventListener('mousemove', this.throttle(this.handleMouseMove, 10), false);
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    }

    /**
     * 重绘历史记录中的所有元素
     * 
     * @memberof YMPaint
     */
    public redrawAll(): void {
        console.log('redrawAll: ', this.history);
        const self = this;
        this.history.forEach(function (item) {
            if (item instanceof Rectangle) {
                self.paint.drawRect(item.x, item.y, item.width, item.height, item.radius, item.color, item.lineWidth);
            } else if (item instanceof Curve) {
                self.paint.drawPoint(item.points, item.lineWidth, item.color);
            } else if (item instanceof Circle) {
                self.paint.drawEllipse(item.x, item.y, item.a, item.b, item.lineWidth, item.color);
            } else if (item instanceof Arrow) {
                self.paint.drawArrow(item.beginPoint, item.stopPoint, item.color, item.range);
            } else if (item instanceof Line) {
                self.paint.drawLine(item.begin, item.end, item.color, item.lineWidth);
            }
        });
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public getColor(): string {
        return this.color;
    }

    public setShape(shape: string): void {
        this.shape = shape;
    }

    public getShape(): string {
        return this.shape;
    }

    /**
     * 撤销一步
     * 
     * @memberof YMPaint
     */
    public undo() {
        if (this.history.length > 0) {
            this.history.pop();
            // 撤销后重绘
            this.paint.clean();
            this.redrawAll();
            console.log('undo', this.history);
        }
    }

    /**
     * 清屏
     * 
     * @memberof YMPaint
     */
    public cleanAll(): void {
        this.history = [];
        this.paint.clean();
    }

    /**
     * 函数节流
     * 
     * @static
     * @param {Function} callback 
     * @param {number} delay 
     * @returns {Function} 
     * @memberof YMPaint
     */
    public throttle(callback: Function, delay: number) {
        var self = this;
        var previousCall = new Date().getTime();
        return function () {
            var time = new Date().getTime();
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(self, arguments);
            }
        }
    }
}