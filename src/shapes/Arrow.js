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
 * 箭头
 *
 * @class Arrow
 * @extends {ShapeBase}
 */
var Arrow = /** @class */ (function (_super) {
    __extends(Arrow, _super);
    function Arrow(beginPoint, stopPoint, range, color, lineWidth) {
        if (lineWidth === void 0) { lineWidth = 0; }
        var _this = _super.call(this, color, lineWidth) || this;
        _this.beginPoint = beginPoint;
        _this.stopPoint = stopPoint;
        _this.range = range;
        return _this;
    }
    return Arrow;
}(ShapeBase_1.default));
exports.default = Arrow;
//# sourceMappingURL=Arrow.js.map