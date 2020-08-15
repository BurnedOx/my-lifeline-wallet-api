"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringSplit = void 0;
const class_transformer_1 = require("class-transformer");
function StringSplit(split = ",") {
    return (target, propertyKey) => {
        class_transformer_1.Transform((value) => {
            var _a;
            if (Array.isArray(value)) {
                return value;
            }
            return (_a = value === null || value === void 0 ? void 0 : value.split(split)) !== null && _a !== void 0 ? _a : [];
        })(target, propertyKey);
    };
}
exports.StringSplit = StringSplit;
//# sourceMappingURL=string-split.js.map