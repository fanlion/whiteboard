export var isDebug = false;
export var version = '1.0.0';

import Paint from './Paint';
import Point from './shapes/Point';
import Circle from './shapes/Circle';
import Rectangle from './shapes/Rectangle';
import Curve from './shapes/Curve';


interface Options {
    canvas: HTMLCanvasElement,
    color?: string,
    lineWidth?: number,
    radius?: number,
    shape?: string
}

interface History {
    lines: Curve[],
    arrows: Arrow[],
    circles: Circle[],
    rects: Rectangle[]
}

interface Arrow {
    beginPoint: Point,
    stopPoint: Point,
    range: number,
    color: string
}

export class YMPaint {
    static edgeLen: number = 25;
    static angle: number = 15;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: Paint;

    private color: string;
    private lineWidth: number;
    private shape: string;
    private radius: number;

    private drawing: boolean;

    private points: Point[];

    private beginPoint: Point;
    private stopPoint: Point;
    
    private rect: Rectangle;
    private angle: number;
    private range: number;
    private history: History;

    constructor(config: Options) {
        this.canvas = config.canvas;
        this.context = this.canvas.getContext('2d');

        // 画笔
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
        this.history = {
            lines: [],
            rects: [],
            circles: [],
            arrows: [],
        }

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
        } else if (this.shape === 'line') {
            this.points.push(new Point(x, y));
            this.paint.drawPoint(this.points, this.lineWidth, this.color);
        } else if (this.shape === 'circle') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        } else if (this.shape === 'arrow') {
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
                    this.rect.x = e.clientY;
                } else {
                    this.rect.y = this.beginPoint.y;
                }
                this.paint.clean();
                this.redrawAll();
                this.paint.drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height, this.radius, this.color, this.lineWidth);
            } else if (this.shape === 'line') {
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
            const rect = {
                x: this.rect.x,
                y: this.rect.y,
                width: this.rect.width,
                height: this.rect.height,
                radius: this.radius,
                color: this.color,
                lineWidth: this.lineWidth
            };

            this.rect = new Rectangle();
            this.history.rects.push(rect);
        } else if (this.shape === 'line') {
            const line = {
                points: this.points,
                lineWidth: this.lineWidth,
                color: this.color
            };
            this.history.lines.push(line);
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

            this.history.circles.push(circle);
            this.beginPoint = new Point();
        } else if (this.shape === 'arrow') {
            const arrow = {
                beginPoint: this.beginPoint,
                stopPoint: new Point(e.clientX, e.clientY),
                range: this.range,
                color: this.color
            };
            this.history.arrows.push(arrow);
            this.beginPoint = new Point(0, 0);
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
     * @private
     * @memberof YMPaint
     */
    private redrawAll() {
        console.log('redrawAll: ', this.history);
        const self = this;
        if (this.history.rects.length > 0) {
            this.history.rects.forEach(function (item) {
                self.paint.drawRect(item.x, item.y, item.width, item.height, item.radius, item.color, item.lineWidth);
            });
        }

        if (this.history.lines.length > 0) {
            this.history.lines.forEach(function (item) {
                self.paint.drawPoint(item.points, item.lineWidth, item.color);
            });
        }

        if (this.history.circles.length > 0) {
            this.history.circles.forEach(function (item) {
                self.paint.drawEllipse(item.x, item.y, item.a, item.b, item.lineWidth, item.color);
            });
        }

        if (this.history.arrows.length > 0) {
            this.history.arrows.forEach(function (item) {
                self.paint.drawArrow(item.beginPoint, item.stopPoint, item.color, item.range);
            });
        }
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