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
 * 圆
 *
 * @class Circle
 * @extends {ShapeBase}
 */
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, a, b, color, lineWidth) {
        var _this = _super.call(this, color, lineWidth) || this;
        _this.x = x;
        _this.y = y;
        _this.a = a;
        _this.b = b;
        return _this;
    }
    return Circle;
}(ShapeBase_1.default));
exports.default = Circle;
//# sourceMappingURL=Circle.js.map