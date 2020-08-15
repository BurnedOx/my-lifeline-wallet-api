"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalDTO = void 0;
const class_validator_1 = require("class-validator");
let WithdrawalDTO = (() => {
    class WithdrawalDTO {
    }
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.Min(200),
        class_validator_1.Max(3000),
        class_validator_1.IsDivisibleBy(100),
        __metadata("design:type", Number)
    ], WithdrawalDTO.prototype, "withdrawAmount", void 0);
    return WithdrawalDTO;
})();
exports.WithdrawalDTO = WithdrawalDTO;
//# sourceMappingURL=withdrawal.dto.js.map