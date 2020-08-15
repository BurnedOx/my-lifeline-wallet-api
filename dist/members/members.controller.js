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
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const members_service_1 = require("./members.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const validation_pipe_1 = require("../common/validation.pipe");
const common_header_decorator_1 = require("../common/decorators/common-header-decorator");
const base_header_dto_1 = require("../common/dto/base-header.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles-decorator");
let MembersController = (() => {
    let MembersController = class MembersController {
        constructor(membersService) {
            this.membersService = membersService;
        }
        directMembers(headers) {
            return this.membersService.directMembers(headers.userId);
        }
        adminGetDirect(id) {
            return this.membersService.directMembers(id);
        }
        downlineMembers(headers) {
            return this.membersService.downlineMembers(headers.userId);
        }
        singleLegMembers(headers) {
            return this.membersService.singleLegMembers(headers.userId);
        }
        getAdminSingleLeg(id) {
            return this.membersService.singleLegMembers(id);
        }
        updateSingleLeg() {
            return this.membersService.updateSingleLeg();
        }
    };
    __decorate([
        common_1.Get('direct'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], MembersController.prototype, "directMembers", null);
    __decorate([
        common_1.Get(':id/direct'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], MembersController.prototype, "adminGetDirect", null);
    __decorate([
        common_1.Get('downline'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], MembersController.prototype, "downlineMembers", null);
    __decorate([
        common_1.Get('single-leg'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], MembersController.prototype, "singleLegMembers", null);
    __decorate([
        common_1.Get(':id/single-leg'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], MembersController.prototype, "getAdminSingleLeg", null);
    __decorate([
        common_1.Put('update-single-leg'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MembersController.prototype, "updateSingleLeg", null);
    MembersController = __decorate([
        common_1.Controller('members'),
        __metadata("design:paramtypes", [members_service_1.MembersService])
    ], MembersController);
    return MembersController;
})();
exports.MembersController = MembersController;
//# sourceMappingURL=members.controller.js.map