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
exports.EpinController = void 0;
const common_1 = require("@nestjs/common");
const epin_service_1 = require("./epin.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const common_header_decorator_1 = require("../common/decorators/common-header-decorator");
const base_header_dto_1 = require("../common/dto/base-header.dto");
const validation_pipe_1 = require("../common/validation.pipe");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles-decorator");
let EpinController = (() => {
    let EpinController = class EpinController {
        constructor(epinService) {
            this.epinService = epinService;
        }
        getAll(status) {
            return this.epinService.getAll(status);
        }
        getEpin(headers) {
            return this.epinService.getEpin(headers.userId);
        }
        generate() {
            return this.epinService.generate();
        }
    };
    __decorate([
        common_1.Get(),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Query('status')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EpinController.prototype, "getAll", null);
    __decorate([
        common_1.Get('my'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], EpinController.prototype, "getEpin", null);
    __decorate([
        common_1.Post(),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EpinController.prototype, "generate", null);
    EpinController = __decorate([
        common_1.Controller('epin'),
        __metadata("design:paramtypes", [epin_service_1.EpinService])
    ], EpinController);
    return EpinController;
})();
exports.EpinController = EpinController;
//# sourceMappingURL=epin.controller.js.map