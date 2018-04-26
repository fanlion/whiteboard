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
 * 直线
 *
 * @class Line
 * @extends {ShapeBase}
 */
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(begin, end, color, lineWidth) {
        var _this = _super.call(this, color, lineWidth) || this;
        _this.begin = begin;
        _this.end = end;
        return _this;
    }
    return Line;
}(ShapeBase_1.default));
exports.default = Line;
//# sourceMappingURL=Line.js.map