import { ParamIdsDTO } from "@common/dto/multi-ids.dto";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Request } from "express";

export const ParamIds = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return plainToClass(ParamIdsDTO, request.params);
});