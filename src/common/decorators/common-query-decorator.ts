import { DateQueryDTO } from "@common/dto/date-query.dto";
import { PagingQueryDTO } from "@common/dto/paging-query.dto";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Request } from "express";

export const PagingQuery = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return plainToClass(PagingQueryDTO, request.query);
});

export const DateQuery = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return plainToClass(DateQueryDTO, request.query);
});