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
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("./transaction.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const validation_pipe_1 = require("../common/validation.pipe");
const base_header_dto_1 = require("../common/dto/base-header.dto");
const common_header_decorator_1 = require("../common/decorators/common-header-decorator");
const roles_decorator_1 = require("../common/decorators/roles-decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let TransactionController = (() => {
    let TransactionController = class TransactionController {
        constructor(transactionService) {
            this.transactionService = transactionService;
        }
        getMyTransactions(headers) {
            return this.transactionService.getUserTransactions(headers.userId);
        }
        getTransactionsById(id) {
            return this.transactionService.getUserTransactions(id);
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
    ], TransactionController.prototype, "getMyTransactions", null);
    __decorate([
        common_1.Get(':id'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], TransactionController.prototype, "getTransactionsById", null);
    TransactionController = __decorate([
        common_1.Controller('transaction'),
        __metadata("design:paramtypes", [transaction_service_1.TransactionService])
    ], TransactionController);
    return TransactionController;
})();
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map