"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebug = false;
exports.version = '1.0.0';
var Paint_1 = require("./Paint");
var Point_1 = require("./shapes/Point");
var Circle_1 = require("./shapes/Circle");
var Rectangle_1 = require("./shapes/Rectangle");
var Curve_1 = require("./shapes/Curve");
var Arrow_1 = require("./shapes/Arrow");
var Line_1 = require("./shapes/Line");
var Triangle_1 = require("./shapes/Triangle");
/**
 * YMPaint
 *
 * @export
 * @class YMPaint
 */
var YMPaint = /** @class */ (function () {
    function YMPaint(config, listeners) {
        this.canvas = config.canvas;
        this.paint = new Paint_1.default(this.canvas);
        this.listeners = listeners;
        this.color = config.color || 'black';
        this.lineWidth = config.lineWidth || 2;
        this.radius = config.radius || 0;
        this.shape = config.shape || 'line';
        this.angle = 0;
        this.range = 25;
        this.beginPoint = new Point_1.default();
        this.stopPoint = new Point_1.default();
        this.rect = new Rectangle_1.default();
        this.triangle = new Triangle_1.default();
        this.points = [];
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
    YMPaint.prototype.handleMouseDown = function (e) {
        var x = e.clientX;
        var y = e.clientY;
        this.drawing = true;
        if (this.shape === 'rect') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        }
        else if (this.shape === 'curve') {
            this.points.push(new Point_1.default(x, y));
            this.paint.drawPoint(this.points, this.lineWidth, this.color);
        }
        else if (this.shape === 'circle') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        }
        else if (this.shape === 'arrow') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        }
        else if (this.shape === 'line') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
        }
        else if (this.shape === 'triangle') {
            this.beginPoint.x = x;
            this.beginPoint.y = y;
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
                this.rect.width = Math.abs(this.beginPoint.x - e.clientX);
                this.rect.height = Math.abs(this.beginPoint.y - e.clientY);
                // 确定正确的矩形左上角坐标
                if (this.beginPoint.x > e.clientX) {
                    this.rect.x = e.clientX;
                }
                else {
                    this.rect.x = this.beginPoint.x;
                }
                if (this.beginPoint.y > e.clientY) {
                    this.rect.y = e.clientY;
                }
                else {
                    this.rect.y = this.beginPoint.y;
                }
                this.paint.clean();
                this.redrawAll();
                this.paint.drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height, this.radius, this.color, this.lineWidth);
            }
            else if (this.shape === 'curve') {
                this.points.push(new Point_1.default(e.clientX, e.clientY));
                this.paint.drawPoint(this.points, this.lineWidth, this.color);
            }
            else if (this.shape === 'circle') {
                var pointX = 0, pointY = 0;
                if (this.beginPoint.x > e.clientX) {
                    pointX = this.beginPoint.x - Math.abs(this.beginPoint.x - e.clientX) / 2;
                }
                else {
                    pointX = Math.abs(this.beginPoint.x - e.clientX) / 2 + this.beginPoint.x;
                }
                if (this.beginPoint.y > e.clientY) {
                    pointY = this.beginPoint.y - Math.abs(this.beginPoint.y - e.clientY) / 2;
                }
                else {
                    pointY = Math.abs(this.beginPoint.y - e.clientY) / 2 + this.beginPoint.y;
                }
                var lineX = Math.abs(this.beginPoint.x - e.clientX) / 2;
                var lineY = Math.abs(this.beginPoint.y - e.clientY) / 2;
                this.paint.clean();
                this.redrawAll();
                this.paint.drawEllipse(pointX, pointY, lineX, lineY, this.lineWidth, this.color);
            }
            else if (this.shape === 'arrow') {
                this.stopPoint.x = e.clientX;
                this.stopPoint.y = e.clientY;
                this.paint.clean();
                this.redrawAll();
                this.paint.drawArrow(this.beginPoint, this.stopPoint, this.color, this.range);
            }
            else if (this.shape === 'line') {
                var stopPoint = new Point_1.default(e.clientX, e.clientY);
                this.paint.clean();
                this.redrawAll();
                this.paint.drawLine(this.beginPoint, stopPoint, this.color, this.lineWidth);
            }
            else if (this.shape === 'triangle') {
                this.triangle.topPoint.y = this.beginPoint.y;
                this.triangle.topPoint.x = e.clientX;
                this.triangle.leftPoint.x = this.beginPoint.x;
                this.triangle.leftPoint.y = e.clientY;
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
            var rect = new Rectangle_1.default(this.rect.x, this.rect.y, this.rect.width, this.rect.height, this.radius, this.color, this.lineWidth);
            this.rect = new Rectangle_1.default();
            this.history.push(rect);
            // 回调
            this.listeners.onDrawing && this.listeners.onDrawing(rect);
        }
        else if (this.shape === 'curve') {
            var curve = new Curve_1.default(this.points, this.color, this.lineWidth);
            this.history.push(curve);
            this.points = [];
            // 回调
            this.listeners && this.listeners.onDrawing && this.listeners.onDrawing(curve);
        }
        else if (this.shape === 'circle') {
            var pointX = 0, pointY = 0;
            if (this.beginPoint.x > e.clientX) {
                pointX = this.beginPoint.x - Math.abs(this.beginPoint.x - e.clientX) / 2;
            }
            else {
                pointX = Math.abs(this.beginPoint.x - e.clientX) / 2 + this.beginPoint.x;
            }
            if (this.beginPoint.y > e.clientY) {
                pointY = this.beginPoint.y - Math.abs(this.beginPoint.y - e.clientY) / 2;
            }
            else {
                pointY = Math.abs(this.beginPoint.y - e.clientY) / 2 + this.beginPoint.y;
            }
            var lineX = Math.abs(this.beginPoint.x - e.clientX) / 2;
            var lineY = Math.abs(this.beginPoint.y - e.clientY) / 2;
            var circle = new Circle_1.default(pointX, pointY, lineX, lineY, this.color, this.lineWidth);
            this.history.push(circle);
            this.beginPoint = new Point_1.default();
            // 回调
            this.listeners && this.listeners.onDrawing && this.listeners.onDrawing(circle);
        }
        else if (this.shape === 'arrow') {
            var arrow = new Arrow_1.default(this.beginPoint, new Point_1.default(e.clientX, e.clientY), this.range, this.color, this.lineWidth);
            this.history.push(arrow);
            this.beginPoint = new Point_1.default();
        }
        else if (this.shape === 'line') {
            var stopPoint = new Point_1.default(e.clientX, e.clientY);
            var line = new Line_1.default(this.beginPoint, stopPoint, this.color, this.lineWidth);
            this.history.push(line);
            this.beginPoint = new Point_1.default();
            // 回调
            this.listeners && this.listeners.onDrawing && this.listeners.onDrawing(line);
        }
        else if (this.shape === 'triangle') {
        }
        this.drawing = false;
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
    /**
     * 重绘历史记录中的所有元素
     *
     * @memberof YMPaint
     */
    YMPaint.prototype.redrawAll = function () {
        console.log('redrawAll: ', this.history);
        var self = this;
        this.history.forEach(function (item) {
            if (item instanceof Rectangle_1.default) {
                self.paint.drawRect(item.x, item.y, item.width, item.height, item.radius, item.color, item.lineWidth);
            }
            else if (item instanceof Curve_1.default) {
                self.paint.drawPoint(item.points, item.lineWidth, item.color);
            }
            else if (item instanceof Circle_1.default) {
                self.paint.drawEllipse(item.x, item.y, item.a, item.b, item.lineWidth, item.color);
            }
            else if (item instanceof Arrow_1.default) {
                self.paint.drawArrow(item.beginPoint, item.stopPoint, item.color, item.range);
            }
            else if (item instanceof Line_1.default) {
                self.paint.drawLine(item.begin, item.end, item.color, item.lineWidth);
            }
        });
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
     * 撤销一步
     *
     * @memberof YMPaint
     */
    YMPaint.prototype.undo = function () {
        if (this.history.length > 0) {
            this.history.pop();
            // 撤销后重绘
            this.paint.clean();
            this.redrawAll();
            console.log('undo', this.history);
        }
    };
    /**
     * 清屏
     *
     * @memberof YMPaint
     */
    YMPaint.prototype.cleanAll = function () {
        this.history = [];
        this.paint.clean();
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