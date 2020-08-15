"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHeader = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const base_header_dto_1 = require("../dto/base-header.dto");
exports.CustomHeader = common_1.createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return class_transformer_1.plainToClass(base_header_dto_1.HeaderDTO, request.headers, { excludeExtraneousValues: true });
});
//# sourceMappingURL=common-header-decorator.js.map