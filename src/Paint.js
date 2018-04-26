"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Paint = /** @class */ (function () {
    function Paint(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
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
    Paint.prototype.drawRect = function (x, y, width, height, radius, color, lineWidth) {
        this.createRect(x, y, width, height, radius, color, 'stroke', lineWidth);
    };
    Paint.prototype.getRadian = function (beginPoint, stopPoint) {
        // this.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
    };
    return Paint;
}());
//# sourceMappingURL=Paint.js.map