"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point_1 = require("./shapes/Point");
/**
 * 绘画逻辑
 *
 * @class Paint
 */
var Paint = /** @class */ (function () {
    function Paint(canvas) {
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
    Paint.prototype.drawPoint = function (points, lineWidth, color) {
        for (var i = 0; i < points.length; i++) {
            this.context.beginPath();
            if (points[i].y && i) {
                this.context.moveTo(points[i - 1].x, points[i - 1].y);
            }
            else {
                this.context.moveTo(points[i].x - 1, points[i].y);
            }
            this.context.lineWidth = lineWidth;
            this.context.strokeStyle = color;
            this.context.lineTo(points[i].x, points[i].y);
            this.context.closePath();
            this.context.stroke();
        }
    };
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
    Paint.prototype.drawEllipse = function (x, y, a, b, lineWidth, color) {
        this.context.beginPath();
        this.context.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
        this.context.lineWidth = lineWidth;
        this.context.fillStyle = 'rgba(0, 0, 0, 0)';
        this.context.strokeStyle = color;
        this.context.fill();
        this.context.stroke();
    };
    Paint.prototype.createRect = function (x, y, width, height, radius, color, type, lineWidth) {
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
    Paint.prototype.drawRect = function (x, y, width, height, radius, color, lineWidth) {
        this.createRect(x, y, width, height, radius, color, 'stroke', lineWidth);
    };
    Paint.prototype.arrowCoord = function (beginPoint, stopPoint, range) {
        var polygonVertex = [];
        polygonVertex[0] = beginPoint.x;
        polygonVertex[1] = beginPoint.y;
        polygonVertex[6] = stopPoint.x;
        polygonVertex[7] = stopPoint.y;
        // 获取弧度
        var angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
        polygonVertex[8] = stopPoint.x - Paint.edgeLen * Math.cos(Math.PI / 180 * (angle + range));
        polygonVertex[9] = stopPoint.y - Paint.edgeLen * Math.sin(Math.PI / 180 * (angle + range));
        polygonVertex[4] = stopPoint.x - Paint.edgeLen * Math.cos(Math.PI / 180 * (angle - range));
        polygonVertex[5] = stopPoint.y - Paint.edgeLen * Math.sin(Math.PI / 180 * (angle - range));
        return polygonVertex;
    };
    Paint.prototype.sideCoord = function (polygonVertex) {
        var x = (polygonVertex[4] + polygonVertex[8]) / 2;
        var y = (polygonVertex[5] + polygonVertex[9]) / 2;
        var midPoint = new Point_1.default(x, y);
        polygonVertex[2] = (polygonVertex[4] + midPoint.x) / 2;
        polygonVertex[3] = (polygonVertex[5] + midPoint.y) / 2;
        polygonVertex[10] = (polygonVertex[8] + midPoint.x) / 2;
        polygonVertex[11] = (polygonVertex[9] + midPoint.y) / 2;
    };
    /**
     * 画箭头
     *
     * @param {Point} beginPoint
     * @param {Point} stopPoint
     * @param {string} color
     * @param {number} range
     * @memberof Paint
     */
    Paint.prototype.drawArrow = function (beginPoint, stopPoint, color, range) {
        var polygonVertex = this.arrowCoord(beginPoint, stopPoint, range);
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
    };
    /**
     * 绘制直线
     *
     * @param {Point} beginPoint
     * @param {Point} stopPoint
     * @param {string} color
     * @param {number} lineWidth
     * @memberof Paint
     */
    Paint.prototype.drawLine = function (beginPoint, stopPoint, color, lineWidth) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth;
        this.context.moveTo(beginPoint.x, beginPoint.y);
        this.context.lineTo(stopPoint.x, stopPoint.y);
        this.context.closePath();
        this.context.stroke();
    };
    /**
     * 清空画板
     *
     * @memberof Paint
     */
    Paint.prototype.clean = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Paint.edgeLen = 25;
    Paint.angle = 15;
    return Paint;
}());
exports.default = Paint;
//# sourceMappingURL=Paint.js.map