import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { HeaderDTO } from "../dto/base-header.dto";
import { Request } from "express";

export const CustomHeader = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return plainToClass(HeaderDTO, request.headers, { excludeExtraneousValues: true });
});