import { Controller, Get, UseGuards, Param, Post, Put, Body, UsePipes, Query } from '@nestjs/common';
import { EpinService } from './epin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { hasRoles } from 'src/common/decorators/roles-decorator';

@Controller('epin')
export class EpinController {
    constructor(private readonly epinService: EpinService) { }

    @Get()
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    getAll(@Query('status') status?: 'used' | 'unused') {
        return this.epinService.getAll(status);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getEpin(@CustomHeader() headers: HeaderDTO) {
        return this.epinService.getEpin(headers.userId);
    }

    @Post()
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    generate() {
        return this.epinService.generate();
    }
}
