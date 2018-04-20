"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebug = false;
exports.version = '1.0.0';
var YMPaint = /** @class */ (function () {
    function YMPaint(config) {
        console.log('config', config);
        this.canvas = config.canvas;
        this.context = this.canvas.getContext('2d');
        this.color = config.color || 'black';
        this.lineWidth = config.lineWidth || 2;
        this.radius = config.radius || 0;
        this.shape = config.shape || 'line';
        this.rect = {};
        this.history = {
            lines: [],
            rects: [],
            circles: [],
            arrows: [],
        };
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
    YMPaint.prototype.handleMouseDown = function (e) {
        console.log('mousedown: x: %s, y: %s', e.clientX, e.clientY);
        console.log('mousedown: shape: %s', this.shape);
        console.log('mousedown this', this);
        console.log('mousedown e', e);
        this.drawing = true;
        if (this.shape === 'rect') {
            this.rect.x = e.clientX;
            this.rect.y = e.clientY;
        }
        console.log('mousedown rect', this.rect);
    };
    /**
     * 鼠标mousemove事件处理器
     *
     * @private
     * @param {MouseEvent} e
     * @memberof YMPaint
     */
    YMPaint.prototype.handleMouseMove = function (e) {
        console.log('mousemove shape', this.shape);
        if (this.drawing) {
            if (this.shape === 'rect') {
                console.log('mousemove: x: %s, y: %s', e.clientX, e.clientY);
                this.rect.width = Math.abs(this.rect.x - e.clientX);
                this.rect.height = Math.abs(this.rect.y - e.clientY);
                if (this.rect.x > e.clientX) {
                    this.rect.realX = e.clientX;
                }
                else {
                    this.rect.realX = this.rect.x;
                }
                if (this.rect.y > e.clientY) {
                    this.rect.realY = e.clientY;
                }
                else {
                    this.rect.realY = this.rect.y;
                }
                this.clear();
                this.redrawAll();
                this.drawRect(this.rect.realX, this.rect.realY, this.rect.width, this.rect.height, this.radius, this.color, this.lineWidth);
            }
        }
    };
    /**
     * 鼠标mouseup事件处理器
     *
     * @private
     * @param {MouseEvent} e
     * @memberof YMPaint
     */
    YMPaint.prototype.handleMouseUp = function (e) {
        if (this.shape === 'rect') {
            var rect = {
                realX: this.rect.x,
                realY: this.rect.y,
                width: this.rect.width,
                height: this.rect.height,
                radius: this.radius,
                color: this.color,
                lineWidth: this.lineWidth
            };
            this.rect = {};
            this.history.rects.push(rect);
        }
        this.drawing = false;
    };
    YMPaint.prototype.createRect = function (x, y, width, height, radius, color, type, lineWidth) {
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
    };
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
    YMPaint.prototype.drawRect = function (x, y, width, height, radius, color, lineWidth) {
        this.createRect(x, y, width, height, radius, color, 'stroke', lineWidth);
    };
    /**
     * 绑定事件
     *
     * @private
     * @memberof YMPaint
     */
    YMPaint.prototype.bindEvent = function () {
        // 给canvas绑定事件
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.canvas.addEventListener('mousemove', this.throttle(this.handleMouseMove, 100), false);
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    };
    /**
     * 重绘历史记录中的所有元素
     *
     * @private
     * @memberof YMPaint
     */
    YMPaint.prototype.redrawAll = function () {
        debugger;
        console.log('redrawAll', this.history['rects']);
        if (this.history.rects.length > 0) {
            var self_1 = this;
            this.history.rects.forEach(function (item) {
                self_1.drawRect(item.realX, item.realY, item.width, item.height, item.radius, item.color, item.lineWidth);
            });
        }
    };
    /**
     * 清空屏幕内容
     *
     * @private
     * @memberof YMPaint
     */
    YMPaint.prototype.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    YMPaint.prototype.setColor = function (color) {
        this.color = color;
    };
    YMPaint.prototype.getColor = function () {
        return this.color;
    };
    YMPaint.prototype.setShape = function (shape) {
        this.shape = shape;
    };
    YMPaint.prototype.getShape = function () {
        return this.shape;
    };
    /**
     * 函数节流
     *
     * @static
     * @param {Function} callback
     * @param {number} delay
     * @returns {Function}
     * @memberof YMPaint
     */
    YMPaint.prototype.throttle = function (callback, delay) {
        var self = this;
        var previousCall = new Date().getTime();
        return function () {
            var time = new Date().getTime();
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(self, arguments);
            }
        };
    };
    return YMPaint;
}());
exports.YMPaint = YMPaint;
//# sourceMappingURL=ympaint.js.map