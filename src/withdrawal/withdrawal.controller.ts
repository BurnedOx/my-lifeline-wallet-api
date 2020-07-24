import { Controller, Get, UseGuards, UsePipes, Body, Query, Post, Put, Param } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { WithdrawalDTO } from './withdrawal.dto';

@Controller('withdrawal')
export class WithdrawalController {
    constructor(private readonly withdrawlService: WithdrawalService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getByUserId(@CustomHeader() headers: HeaderDTO) {
        return this.withdrawlService.get(headers.userId);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
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
}
