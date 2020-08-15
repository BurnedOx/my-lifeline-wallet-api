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
exports.AccountsController = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("./accounts.service");
const validation_pipe_1 = require("../common/validation.pipe");
const accounts_dto_1 = require("./accounts.dto");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const base_header_dto_1 = require("../common/dto/base-header.dto");
const common_header_decorator_1 = require("../common/decorators/common-header-decorator");
const roles_decorator_1 = require("../common/decorators/roles-decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let AccountsController = (() => {
    let AccountsController = class AccountsController {
        constructor(accountsService) {
            this.accountsService = accountsService;
        }
        getAllUsers() {
            return this.accountsService.getAll();
        }
        getUser(id) {
            return this.accountsService.findOne(id);
        }
        registerAdmin(data) {
            return this.accountsService.registerAdmin(data);
        }
        loginAdmin(data) {
            return this.accountsService.login(data, true);
        }
        register(data) {
            return this.accountsService.register(data);
        }
        login(data) {
            return this.accountsService.login(data);
        }
        getDetails(headers) {
            return this.accountsService.getDetails(headers.userId);
        }
        getDetailsByAdmin(id) {
            return this.accountsService.getDetails(id);
        }
        activateAccount(id, headers) {
            return this.accountsService.activateAccount(id, headers.userId);
        }
        updateProfile(data, headers) {
            return this.accountsService.updateProfile(data, headers.userId);
        }
        updateProfileByAdmin(data, userId) {
            return this.accountsService.updateProfile(data, userId);
        }
        changePassword(data, headers) {
            return this.accountsService.updatePassword(data, headers.userId);
        }
        forgotPassword(userId, password) {
            return this.accountsService.forgotPassword(userId, password);
        }
        updateBankDetails(data, headers) {
            return this.accountsService.updateBankDetails(data, headers.userId);
        }
        updateBankDetailsByAdmin(id, data) {
            return this.accountsService.updateBankDetails(data, id);
        }
        updateSponsor(sponsorId, id) {
            return this.accountsService.updateSponsor(id, sponsorId);
        }
        resetWallets() {
            return this.accountsService.resetBalance();
        }
        deleteUser(id) {
            return this.accountsService.deleteUser(id);
        }
    };
    __decorate([
        common_1.Get('users'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "getAllUsers", null);
    __decorate([
        common_1.Get('users/:id'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "getUser", null);
    __decorate([
        common_1.Post('admin/register'),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.AdminRegistrationDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "registerAdmin", null);
    __decorate([
        common_1.Post('admin/login'),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.LoginDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "loginAdmin", null);
    __decorate([
        common_1.Post('register'),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.RegistrationDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "register", null);
    __decorate([
        common_1.Post('login'),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.LoginDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "login", null);
    __decorate([
        common_1.Get('details'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        __param(0, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "getDetails", null);
    __decorate([
        common_1.Get('details/:id'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "getDetailsByAdmin", null);
    __decorate([
        common_1.Put('activate'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body('id')), __param(1, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "activateAccount", null);
    __decorate([
        common_1.Put('profile'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()), __param(1, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.ProfileDTO, base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "updateProfile", null);
    __decorate([
        common_1.Put('profile/:id'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()), __param(1, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.ProfileDTO, String]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "updateProfileByAdmin", null);
    __decorate([
        common_1.Put('password'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()), __param(1, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.UpdatePasswordDTO, base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "changePassword", null);
    __decorate([
        common_1.Put('password/:id'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')), __param(1, common_1.Body('password')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "forgotPassword", null);
    __decorate([
        common_1.Put('bank'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()), __param(1, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [accounts_dto_1.BankDTO, base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "updateBankDetails", null);
    __decorate([
        common_1.Put('bank/:id'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')), __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, accounts_dto_1.BankDTO]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "updateBankDetailsByAdmin", null);
    __decorate([
        common_1.Put('update-sponsor/:id'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body('sponsorId')), __param(1, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "updateSponsor", null);
    __decorate([
        common_1.Put('wallet-reset'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "resetWallets", null);
    __decorate([
        common_1.Delete(':id'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], AccountsController.prototype, "deleteUser", null);
    AccountsController = __decorate([
        common_1.Controller('accounts'),
        __metadata("design:paramtypes", [accounts_service_1.AccountsService])
    ], AccountsController);
    return AccountsController;
})();
exports.AccountsController = AccountsController;
//# sourceMappingURL=accounts.controller.js.map