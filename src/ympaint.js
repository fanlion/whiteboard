"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebug = false;
exports.version = '1.0.0';
var YMPaint = /** @class */ (function () {
    function YMPaint(config) {
        this.canvas = config.canvas;
        this.context = this.canvas.getContext('2d');
        this.color = config.color || 'black';
        this.lineWidth = config.lineWidth || 2;
        this.radius = config.radius || 0;
        this.shape = config.shape || 'line';
        this.lineX = [];
        this.lineY = [];
        this.storage = {};
        this.clickDrag = [];
        this.rect = {};
        this.history = {
            lines: [],
            rects: [],
            circles: [],
            arrows: [],
        };
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
    YMPaint.prototype.handleMouseDown = function (e) {
        var x = e.clientX;
        var y = e.clientY;
        this.drawing = true;
        if (this.shape === 'rect') {
            this.rect.x = x;
            this.rect.y = y;
        }
        else if (this.shape === 'line') {
            this.movePoint(x, y);
            this.drawPoint(this.lineX, this.lineY, this.clickDrag, this.lineWidth, this.color);
        }
        else if (this.shape === 'circle') {
            this.storage.x = x;
            this.storage.y = y;
        }
    };
    /**
     * 鼠标mousemove事件处理器
     *
     * @private
     * @param {MouseEvent} e
     * @memberof YMPaint
     */
    YMPaint.prototype.handleMouseMove = function (e) {
        if (this.drawing) {
            if (this.shape === 'rect') {
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
            else if (this.shape === 'line') {
                this.movePoint(e.clientX, e.clientY);
                this.drawPoint(this.lineX, this.lineY, this.clickDrag, this.lineWidth, this.color);
            }
            else if (this.shape === 'circle') {
                var pointX = 0, pointY = 0;
                if (this.storage.x > e.clientX) {
                    pointX = this.storage.x - Math.abs(this.storage.x - e.clientX) / 2;
                }
                else {
                    pointX = Math.abs(this.storage.x - e.clientX) / 2 + this.storage.x;
                }
                if (this.storage.y > e.clientY) {
                    pointY = this.storage.y - Math.abs(this.storage.y - e.clientY) / 2;
                }
                else {
                    pointY = Math.abs(this.storage.y - e.clientY) / 2 + this.storage.y;
                }
                var lineX = Math.abs(this.storage.x - e.clientX) / 2;
                var lineY = Math.abs(this.storage.y - e.clientY) / 2;
                this.clear();
                this.redrawAll();
                this.drawEllipse(pointX, pointY, lineX, lineY, this.lineWidth, this.color);
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
        }
        else if (this.shape === 'line') {
            var line = {
                x: this.lineX,
                y: this.lineY,
                clickDrag: this.clickDrag,
                lineWidth: this.lineWidth,
                color: this.color
            };
            this.history.lines.push(line);
            this.lineX = [];
            this.lineY = [];
            this.clickDrag = [];
        }
        else if (this.shape === 'circle') {
            var pointX = 0, pointY = 0;
            if (this.storage.x > e.clientX) {
                pointX = this.storage.x - Math.abs(this.storage.x - e.clientX) / 2;
            }
            else {
                pointX = Math.abs(this.storage.x - e.clientX) / 2 + this.storage.x;
            }
            if (this.storage.y > e.clientY) {
                pointY = this.storage.y - Math.abs(this.storage.y - e.clientY) / 2;
            }
            else {
                pointY = Math.abs(this.storage.y - e.clientY) / 2 + this.storage.y;
            }
            var lineX = Math.abs(this.storage.x - e.clientX) / 2;
            var lineY = Math.abs(this.storage.y - e.clientY) / 2;
            var circle = {
                x: pointX,
                y: pointY,
                a: lineX,
                b: lineY,
                lineWidth: this.lineWidth,
                color: this.color
            };
            this.history.circles.push(circle);
            this.storage = {};
        }
        this.drawing = false;
    };
    YMPaint.prototype.movePoint = function (x, y) {
        this.lineX.push(x);
        this.lineY.push(y);
        this.clickDrag.push(y);
    };
    YMPaint.prototype.drawPoint = function (x, y, clickDrag, lineWidth, color) {
        for (var i = 0; i < x.length; i++) {
            this.context.beginPath();
            if (clickDrag[i] && i) {
                this.context.moveTo(x[i - 1], y[i - 1]);
            }
            else {
                this.context.moveTo(x[i] - 1, y[i]);
            }
            this.context.lineWidth = lineWidth;
            this.context.strokeStyle = color;
            this.context.lineTo(x[i], y[i]);
            this.context.closePath();
            this.context.stroke();
        }
    };
    YMPaint.prototype.drawEllipse = function (x, y, a, b, lineWidth, color) {
        this.context.beginPath();
        this.context.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
        this.context.lineWidth = lineWidth;
        this.context.fillStyle = 'rgba(0, 0, 0, 0)';
        this.context.strokeStyle = color;
        this.context.fill();
        this.context.stroke();
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
        this.canvas.addEventListener('mousemove', this.throttle(this.handleMouseMove, 10), false);
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    };
    YMPaint.prototype.resize = function () {
        // TODO: 未来需要获取到父元素的高度
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    /**
     * 重绘历史记录中的所有元素
     *
     * @private
     * @memberof YMPaint
     */
    YMPaint.prototype.redrawAll = function () {
        console.log('redrawAll: ', this.history);
        var self = this;
        if (this.history.rects.length > 0) {
            this.history.rects.forEach(function (item) {
                self.drawRect(item.realX, item.realY, item.width, item.height, item.radius, item.color, item.lineWidth);
            });
        }
        if (this.history.lines.length > 0) {
            this.history.lines.forEach(function (item) {
                self.drawPoint(item.x, item.y, item.clickDrag, item.lineWidth, item.color);
            });
        }
        if (this.history.circles.length > 0) {
            this.history.circles.forEach(function (item) {
                self.drawEllipse(item.x, item.y, item.a, item.b, item.lineWidth, item.color);
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