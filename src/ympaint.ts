export var isDebug = false;
export var version = '1.0.0';

import Point from './shapes/Point';
import Circle from './shapes/Circle';


interface Options {
    canvas: HTMLCanvasElement,
    color?: string,
    lineWidth?: number,
    radius?: number,
    shape?: string
}

interface History {
    lines: Line[],
    arrows: Arrow[],
    circles: Circle[],
    rects: Rect[]
}

interface Arrow {
    beginPoint: Point,
    stopPoint: Point,
    range: number,
    color: string
}

interface Rect {
    x?: number,
    y?: number,
    realX?: number,
    realY?: number,
    width?: number,
    height?: number,
    radius?: number,
    lineWidth?: number,
    color?: string
}

interface Line {
    points: Point[],
    lineWidth: number,
    color: string
}

export class YMPaint {
    static edgeLen: number = 25;
    static angle: number = 15;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private color: string;
    private lineWidth: number;
    private shape: string;
    private radius: number;

    private drawing: boolean;

    private points: Point[];

    private beginPoint: Point;
    private stopPoint: Point;
    private storage: Point;
    private rect: Rect;
    private angle: number;
    private range: number;
    private polygonVertex: number[];
    private history: History;

    constructor(config: Options) {
        this.canvas = config.canvas;
        this.context = this.canvas.getContext('2d');
        this.color = config.color || 'black';
        this.lineWidth = config.lineWidth || 2;
        this.radius = config.radius || 0;
        this.shape = config.shape || 'line';
        this.angle = 0;
        this.range = 25;

        this.points = [];

        this.storage = new Point();
        this.polygonVertex = [];
        this.beginPoint = new Point();
        this.stopPoint = new Point();

        this.rect = {};
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
            this.rect.x = x;
            this.rect.y = y;
        } else if (this.shape === 'line') {
            this.movePoint(x, y);
            this.drawPoint(this.points, this.lineWidth, this.color);
        } else if (this.shape === 'circle') {
            this.storage.setXY(x, y);
        } else if (this.shape === 'arrow') {
            this.beginPoint.setXY(x, y);
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
                this.rect.width = Math.abs(this.rect.x - e.clientX);
                this.rect.height = Math.abs(this.rect.y - e.clientY);
                if (this.rect.x > e.clientX) {
                    this.rect.realX = e.clientX;
                } else {
                    this.rect.realX = this.rect.x;
                }
                if (this.rect.y > e.clientY) {
                    this.rect.realY = e.clientY;
                } else {
                    this.rect.realY = this.rect.y;
                }
                this.clear();
                this.redrawAll();
                this.drawRect(this.rect.realX, this.rect.realY, this.rect.width, this.rect.height, this.radius, this.color, this.lineWidth);
            } else if (this.shape === 'line') {
                this.movePoint(e.clientX, e.clientY);
                this.drawPoint(this.points, this.lineWidth, this.color);
            } else if (this.shape === 'circle') {
                let pointX = 0, pointY = 0;
                if (this.storage.getX() > e.clientX) {
                    pointX = this.storage.getX() - Math.abs(this.storage.getX() - e.clientX) / 2;
                } else {
                    pointX = Math.abs(this.storage.getX() - e.clientX) / 2 + this.storage.getX();
                }

                if (this.storage.getY() > e.clientY) {
                    pointY = this.storage.getY() - Math.abs(this.storage.getY() - e.clientY) / 2;
                } else {
                    pointY = Math.abs(this.storage.getY() - e.clientY) / 2 + this.storage.getY();
                }
                let lineX = Math.abs(this.storage.getX() - e.clientX) / 2;
                let lineY = Math.abs(this.storage.getY() - e.clientY) / 2;
                this.clear();
                this.redrawAll();
                this.drawEllipse(pointX, pointY, lineX, lineY, this.lineWidth, this.color);
            } else if (this.shape === 'arrow') {
                this.stopPoint.setXY(e.clientX, e.clientY);
                this.clear();
                this.redrawAll();
                this.arrowCoord(this.beginPoint, this.stopPoint, this.range)
                this.sideCoord();
                this.drawArrow(this.color);
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
                realX: this.rect.realX,
                realY: this.rect.realY,
                width: this.rect.width,
                height: this.rect.height,
                radius: this.radius,
                color: this.color,
                lineWidth: this.lineWidth
            };
            this.rect = {};
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
            if (this.storage.getX() > e.clientX) {
                pointX = this.storage.getX() - Math.abs(this.storage.getX() - e.clientX) / 2;
            } else {
                pointX = Math.abs(this.storage.getX() - e.clientX) / 2 + this.storage.getX();
            }

            if (this.storage.getY() > e.clientY) {
                pointY = this.storage.getY() - Math.abs(this.storage.getY() - e.clientY) / 2;
            } else {
                pointY = Math.abs(this.storage.getY() - e.clientY) / 2 + this.storage.getY();
            }
            const lineX = Math.abs(this.storage.getX() - e.clientX) / 2;
            const lineY = Math.abs(this.storage.getY() - e.clientY) / 2;
            const circle = new Circle(pointX, pointY, lineX, lineY, this.color, this.lineWidth);

            this.history.circles.push(circle);
            this.storage = new Point();
        } else if (this.shape === 'arrow') {
            const arrow = {
                beginPoint: this.beginPoint,
                stopPoint: new Point(e.clientX, e.clientY),
                range: this.range,
                color: this.color
            };
            this.history.arrows.push(arrow);
            this.beginPoint = new Point();
        }
        this.drawing = false;
    }

    private movePoint(x: number, y: number): void {
        this.points.push(new Point(x, y));
    }

    private drawPoint(points: Point[], lineWidth: number, color: string): void {
        for (let i = 0; i < points.length; i++) {
            this.context.beginPath();
            if (points[i].getY() && i) {
                this.context.moveTo(points[i - 1].getX(), points[i - 1].getY());
            } else {
                this.context.moveTo(points[i].getX() - 1, points[i].getY());
            }
            this.context.lineWidth = lineWidth;
            this.context.strokeStyle = color;
            this.context.lineTo(points[i].getX(), points[i].getY());
            this.context.closePath();
            this.context.stroke();
        }
    }

    private drawEllipse(x: number, y: number, a: number, b: number, lineWidth: number, color: string): void {
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
     * 绘制矩形
     * 
     * @private
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} radius 
     * @param {string} color 
     * @param {number} lineWidth 
     * @memberof YMPaint
     */
    private drawRect(x: number, y: number, width: number, height: number, radius: number, color: string, lineWidth: number): void {
        this.createRect(x, y, width, height, radius, color, 'stroke', lineWidth);
    }

    private getRadian(beginPoint: Point, stopPoint: Point): void {
        this.angle = Math.atan2(stopPoint.getY() - beginPoint.getY(), stopPoint.getX() - beginPoint.getX()) / Math.PI * 180;
    }

    private arrowCoord(beginPoint: Point, stopPoint: Point, range: number): void {
        this.polygonVertex[0] = beginPoint.getX();
        this.polygonVertex[1] = beginPoint.getY();
        this.polygonVertex[6] = stopPoint.getX();
        this.polygonVertex[7] = stopPoint.getY();
        this.getRadian(beginPoint, stopPoint);
        this.polygonVertex[8] = stopPoint.getX() - YMPaint.edgeLen * Math.cos(Math.PI / 180 * (this.angle + range));
        this.polygonVertex[9] = stopPoint.getY() - YMPaint.edgeLen * Math.sin(Math.PI / 180 * (this.angle + range));
        this.polygonVertex[4] = stopPoint.getX() - YMPaint.edgeLen * Math.cos(Math.PI / 180 * (this.angle - range));
        this.polygonVertex[5] = stopPoint.getY() - YMPaint.edgeLen * Math.sin(Math.PI / 180 * (this.angle - range));
    }

    private sideCoord(): void {
        const x = (this.polygonVertex[4] + this.polygonVertex[8]) / 2;
        const y = (this.polygonVertex[5] + this.polygonVertex[9]) / 2;
        const midPoint: Point = new Point(x, y);
        this.polygonVertex[2] = (this.polygonVertex[4] + midPoint.getX()) / 2;
        this.polygonVertex[3] = (this.polygonVertex[5] + midPoint.getY()) / 2;
        this.polygonVertex[10] = (this.polygonVertex[8] + midPoint.getX()) / 2;
        this.polygonVertex[11] = (this.polygonVertex[9] + midPoint.getY()) / 2;
    }

    private drawArrow(color: string): void {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(this.polygonVertex[0], this.polygonVertex[1]);
        this.context.lineTo(this.polygonVertex[2], this.polygonVertex[3]);
        this.context.lineTo(this.polygonVertex[4], this.polygonVertex[5]);
        this.context.lineTo(this.polygonVertex[6], this.polygonVertex[7]);
        this.context.lineTo(this.polygonVertex[8], this.polygonVertex[9]);
        this.context.lineTo(this.polygonVertex[10], this.polygonVertex[11]);
        this.context.closePath();
        this.context.fill();
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
                self.drawRect(item.realX, item.realY, item.width, item.height, item.radius, item.color, item.lineWidth);
            });
        }

        if (this.history.lines.length > 0) {
            this.history.lines.forEach(function (item) {
                self.drawPoint(item.points, item.lineWidth, item.color);
            });
        }

        if (this.history.circles.length > 0) {
            this.history.circles.forEach(function (item) {
                self.drawEllipse(item.x, item.y, item.a, item.b, item.getLineWidth(), item.getColor());
            });
        }

        if (this.history.arrows.length > 0) {
            this.history.arrows.forEach(function (item) {
                // if (item != {})
                self.arrowCoord(item.beginPoint, item.stopPoint, item.range);
                self.sideCoord();
                self.drawArrow(item.color);
            });
        }
    }

    /**
     * 清空屏幕内容
     * 
     * @private
     * @memberof YMPaint
     */
    private clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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