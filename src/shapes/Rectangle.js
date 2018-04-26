"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ShapeBase_1 = require("./ShapeBase");
/**
 * 矩形
 *
 * @class Rectangle
 * @extends {ShapeBase}
 */
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height, radius, color, lineWidth) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (radius === void 0) { radius = 0; }
        if (color === void 0) { color = ''; }
        if (lineWidth === void 0) { lineWidth = 0; }
        var _this = _super.call(this, color, lineWidth) || this;
        _this.x = x;
        _this.y = y;
        _this.width = width;
        _this.height = height;
        _this.radius = radius;
        return _this;
    }
    return Rectangle;
}(ShapeBase_1.default));
exports.default = Rectangle;
//# sourceMappingURL=Rectangle.js.map