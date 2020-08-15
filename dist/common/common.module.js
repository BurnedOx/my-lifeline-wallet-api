"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const http_error_filter_1 = require("./http-error.filter");
const logging_interceptor_1 = require("./logging.interceptor");
let CommonModule = (() => {
    let CommonModule = class CommonModule {
    };
    CommonModule = __decorate([
        common_1.Module({
            providers: [
                {
                    provide: core_1.APP_FILTER,
                    useClass: http_error_filter_1.HttpErrorFilter
                },
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: logging_interceptor_1.LoggingInterceptor
                }
            ]
        })
    ], CommonModule);
    return CommonModule;
})();
exports.CommonModule = CommonModule;
//# sourceMappingURL=common.module.js.map