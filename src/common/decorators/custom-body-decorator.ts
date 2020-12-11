import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Request } from "express";

export const CustomBody = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return plainToClass(data, request.body);
});