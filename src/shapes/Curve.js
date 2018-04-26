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
 * 曲线(自由划线)
 *
 * @class Curve
 * @extends {ShapeBase}
 */
var Curve = /** @class */ (function (_super) {
    __extends(Curve, _super);
    function Curve() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Curve;
}(ShapeBase_1.default));
exports.default = Curve;
//# sourceMappingURL=Curve.js.map