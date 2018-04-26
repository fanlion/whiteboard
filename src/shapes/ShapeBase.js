"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 形状基础类
 *
 * @class ShapeBase
 */
var ShapeBase = /** @class */ (function () {
    function ShapeBase(color, lineWidth) {
        if (color === void 0) { color = 'black'; }
        if (lineWidth === void 0) { lineWidth = 0; }
        this.color = color;
        this.lineWidth = lineWidth;
    }
    return ShapeBase;
}());
exports.default = ShapeBase;
//# sourceMappingURL=ShapeBase.js.map