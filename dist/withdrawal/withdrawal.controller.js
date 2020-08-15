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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalController = void 0;
const common_1 = require("@nestjs/common");
const withdrawal_service_1 = require("./withdrawal.service");
const validation_pipe_1 = require("../common/validation.pipe");
const common_header_decorator_1 = require("../common/decorators/common-header-decorator");
const base_header_dto_1 = require("../common/dto/base-header.dto");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const withdrawal_dto_1 = require("./withdrawal.dto");
const roles_decorator_1 = require("../common/decorators/roles-decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const multi_ids_dto_1 = require("../common/dto/multi-ids.dto");
let WithdrawalController = (() => {
    let WithdrawalController = class WithdrawalController {
        constructor(withdrawlService) {
            this.withdrawlService = withdrawlService;
        }
        getByUserId(headers) {
            return this.withdrawlService.get(headers.userId);
        }
        getAll(status) {
            return this.withdrawlService.getAll(status);
        }
        create(headers, data) {
            return this.withdrawlService.create(headers.userId, data);
        }
        update(id, status) {
            return this.withdrawlService.update(id, status);
        }
        pay(params) {
            return this.withdrawlService.payMultiple(params.ids);
        }
        unpay(params) {
            return this.withdrawlService.unpayMultiple(params.ids);
        }
        cancel(params) {
            return this.withdrawlService.cancelMultiple(params.ids);
        }
    };
    __decorate([
        common_1.Get(),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], WithdrawalController.prototype, "getByUserId", null);
    __decorate([
        common_1.Get('all'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Query('status')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], WithdrawalController.prototype, "getAll", null);
    __decorate([
        common_1.Post(),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()), __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO, withdrawal_dto_1.WithdrawalDTO]),
        __metadata("design:returntype", void 0)
    ], WithdrawalController.prototype, "create", null);
    __decorate([
        common_1.Put(':id'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')), __param(1, common_1.Body('status')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], WithdrawalController.prototype, "update", null);
    __decorate([
        common_1.Put(':ids/pay'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [multi_ids_dto_1.ParamIds]),
        __metadata("design:returntype", void 0)
    ], WithdrawalController.prototype, "pay", null);
    __decorate([
        common_1.Put(':ids/unpay'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [multi_ids_dto_1.ParamIds]),
        __metadata("design:returntype", void 0)
    ], WithdrawalController.prototype, "unpay", null);
    __decorate([
        common_1.Put(':ids/cancel'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [multi_ids_dto_1.ParamIds]),
        __metadata("design:returntype", void 0)
    ], WithdrawalController.prototype, "cancel", null);
    WithdrawalController = __decorate([
        common_1.Controller('withdrawal'),
        __metadata("design:paramtypes", [withdrawal_service_1.WithdrawalService])
    ], WithdrawalController);
    return WithdrawalController;
})();
exports.WithdrawalController = WithdrawalController;
//# sourceMappingURL=withdrawal.controller.js.map