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
exports.BankDTO = exports.ProfileDTO = exports.UpdatePasswordDTO = exports.LoginDTO = exports.AdminRegistrationDTO = exports.RegistrationDTO = void 0;
const class_validator_1 = require("class-validator");
let RegistrationDTO = (() => {
    class RegistrationDTO {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], RegistrationDTO.prototype, "name", void 0);
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", Number)
    ], RegistrationDTO.prototype, "mobile", void 0);
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], RegistrationDTO.prototype, "password", void 0);
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], RegistrationDTO.prototype, "sponsorId", void 0);
    return RegistrationDTO;
})();
exports.RegistrationDTO = RegistrationDTO;
let AdminRegistrationDTO = (() => {
    class AdminRegistrationDTO {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], AdminRegistrationDTO.prototype, "name", void 0);
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", Number)
    ], AdminRegistrationDTO.prototype, "mobile", void 0);
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], AdminRegistrationDTO.prototype, "password", void 0);
    return AdminRegistrationDTO;
})();
exports.AdminRegistrationDTO = AdminRegistrationDTO;
let LoginDTO = (() => {
    class LoginDTO {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], LoginDTO.prototype, "userId", void 0);
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], LoginDTO.prototype, "password", void 0);
    return LoginDTO;
})();
exports.LoginDTO = LoginDTO;
let UpdatePasswordDTO = (() => {
    class UpdatePasswordDTO {
    }
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], UpdatePasswordDTO.prototype, "oldPassword", void 0);
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], UpdatePasswordDTO.prototype, "newPassword", void 0);
    return UpdatePasswordDTO;
})();
exports.UpdatePasswordDTO = UpdatePasswordDTO;
let ProfileDTO = (() => {
    class ProfileDTO {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional(),
        __metadata("design:type", String)
    ], ProfileDTO.prototype, "name", void 0);
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.IsOptional(),
        __metadata("design:type", Number)
    ], ProfileDTO.prototype, "mobile", void 0);
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional(),
        __metadata("design:type", String)
    ], ProfileDTO.prototype, "panNumber", void 0);
    return ProfileDTO;
})();
exports.ProfileDTO = ProfileDTO;
let BankDTO = (() => {
    class BankDTO {
    }
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], BankDTO.prototype, "accountName", void 0);
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], BankDTO.prototype, "bankName", void 0);
    __decorate([
        class_validator_1.IsNumber(),
        __metadata("design:type", Number)
    ], BankDTO.prototype, "accountNumber", void 0);
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], BankDTO.prototype, "isfc", void 0);
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], BankDTO.prototype, "accountType", void 0);
    return BankDTO;
})();
exports.BankDTO = BankDTO;
//# sourceMappingURL=accounts.dto.js.map