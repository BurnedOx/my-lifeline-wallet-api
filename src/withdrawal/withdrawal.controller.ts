import { Controller, Get, UseGuards, UsePipes, Body, Query, Post, Put, Param } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { WithdrawalDTO } from './withdrawal.dto';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParamIdsDTO } from 'src/common/dto/multi-ids.dto';
import { ParamIds } from '@common/decorators/common-param-decorator';

@Controller('withdrawal')
export class WithdrawalController {
    constructor(private readonly withdrawlService: WithdrawalService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getByUserId(@CustomHeader() headers: HeaderDTO) {
        return this.withdrawlService.get(headers.userId);
    }

    @Get('one/:id')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    getById(@Param('id') id: string) {
        return this.withdrawlService.findById(id);
    }

    @Get('all')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    getAll(@Query('status') status?: 'paid' | 'unpaid' | 'cancelled') {
        return this.withdrawlService.getAll(status);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    create(@CustomHeader() headers: HeaderDTO, @Body() data: WithdrawalDTO) {
        return this.withdrawlService.create(headers.userId, data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @Body('status') status: 'paid' | 'unpaid' | 'cancelled') {
        return this.withdrawlService.update(id, status);
    }

    @Put(':ids/pay')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    pay(@ParamIds() params: ParamIdsDTO) {
        return this.withdrawlService.payMultiple(params.ids);
    }

    @Put(':ids/unpay')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    unpay(@ParamIds() params: ParamIdsDTO) {
        return this.withdrawlService.unpayMultiple(params.ids);
    }

    @Put(':ids/cancel')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    cancel(@ParamIds() params: ParamIdsDTO) {
        return this.withdrawlService.cancelMultiple(params.ids);
    }
}
