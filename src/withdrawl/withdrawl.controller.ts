import { Controller, Get, UseGuards, UsePipes, Body, Query, Post, Put, Param } from '@nestjs/common';
import { WithdrawlService } from './withdrawl.service';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { AuthGuard } from 'src/common/auth.guard';
import { WithdrawlDTO } from './withdrawl.dto';

@Controller('withdrawl')
export class WithdrawlController {
    constructor(private readonly withdrawlService: WithdrawlService) {}

    @Get()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    getByUserId(@CustomHeader() headers: HeaderDTO) {
        return this.withdrawlService.get(headers.userId);
    }

    @Get('all')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    getAll(@Query('status') status?: 'paid' | 'unpaid' | 'cancelled') {
        return this.withdrawlService.getAll(status);
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    create(@CustomHeader() headers: HeaderDTO, @Body() data: WithdrawlDTO) {
        return this.withdrawlService.create(headers.userId, data);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @Body('status') status: 'paid' | 'unpaid' | 'cancelled') {
        return this.withdrawlService.update(id, status);
    }
}
