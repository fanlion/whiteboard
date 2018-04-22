export var isDebug = false;
export var version = '1.0.0';

export interface Options {
    canvas: HTMLCanvasElement,
    color?: string,
    lineWidth?: number,
    radius?: number,
    shape?: string
}

interface History {
    lines: Line[],
    arrows: object[],
    circles: object[],
    rects: Rect[]
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
    x: number[],
    y: number[],
    clickDrag: number[],
    lineWidth: number,
    color: string
}

interface Storage {
    x: number,
    y: number
}


export class YMPaint {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private color: string;
    private lineWidth: number;
    private shape: string;
    private radius: number;

    private drawing: boolean;

    private clickDrag: number[];
    private lineX: number[];
    private lineY: number[];
    private beginPoint: object;
    private stopPoint: object;
    private storage: Storage;
    private rect: Rect;
    private polygoVertex: number[];
    private history: History;

    constructor(config: Options) {
        this.canvas = config.canvas;
        this.context = this.canvas.getContext('2d');
        this.color = config.color || 'black';
        this.lineWidth = config.lineWidth || 2;
        this.radius = config.radius || 0;
        this.shape = config.shape || 'line';
        this.lineX = [];
        this.lineY = [];
        this.clickDrag = [];

        this.rect = {};
        this.history = {
            lines: [],
            rects: [],
            circles: [],
            arrows: [],
        }

        // 绑定事件
        this.bindEvent();
        // 设置canvas尺寸为浏览器大小
        this.resize();
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
            this.drawPoint(this.lineX, this.lineY, this.clickDrag, this.lineWidth, this.color);
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
                this.drawPoint(this.lineX, this.lineY, this.clickDrag, this.lineWidth, this.color);
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
                x: this.lineX,
                y: this.lineY,
                clickDrag: this.clickDrag,
                lineWidth: this.lineWidth,
                color: this.color
            };
            this.history.lines.push(line);
            console.log('mouseUp lines: ', this.history.lines);
            this.lineX = [];
            this.lineY = [];
            this.clickDrag = [];
        }

        this.drawing = false;
    }

    private movePoint(x: number, y: number): void {
        this.lineX.push(x);
        this.lineY.push(y);
        this.clickDrag.push(y);
    }

    private drawPoint(x: number[], y: number[], clickDrag: number[], lineWidth: number, color: string): void {
        for (let i = 0; i < x.length; i++) {
            this.context.beginPath();
            if (clickDrag[i] && i) {
                this.context.moveTo(x[i - 1], y[i - 1]);
            } else {
                this.context.moveTo(x[i] - 1, y[i]);
            }
            this.context.lineWidth = lineWidth;
            this.context.strokeStyle = color;
            this.context.lineTo(x[i], y[i]);
            this.context.closePath();
            this.context.stroke();
        }
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

    private resize() {
        // TODO: 未来需要获取到父元素的高度
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
            this.history.lines.forEach(function(item) {
                console.log('item: ', item);
                self.drawPoint(item.x, item.y, item.clickDrag, item.lineWidth, item.color);
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