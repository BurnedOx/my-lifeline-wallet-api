import { Controller, Get, UseGuards, Param, Post, Put, Body } from '@nestjs/common';
import { EpinService } from './epin.service';
import { AuthGuard } from 'src/common/auth.guard';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';

@Controller('epin')
export class EpinController {
    constructor(private readonly epinService: EpinService) { }

    @Get()
    @UseGuards(new AuthGuard())
    getAll() {
        return this.epinService.getAll();
    }

    @Get('unused')
    @UseGuards(new AuthGuard())
    getUnused() {
        return this.epinService.getAllUsable();
    }

    @Get('my')
    @UseGuards(new AuthGuard())
    getEpin(@CustomHeader() headers: HeaderDTO) {
        return this.epinService.getEpin(headers.userId);
    }

    @Post()
    @UseGuards(new AuthGuard())
    generate() {
        return this.epinService.generate();
    }

    @Put()
    @UseGuards(new AuthGuard())
    activateAccount(@Body() id: string, @CustomHeader() headers: HeaderDTO) {
        return this.epinService.update(id, headers.userId);
    }
}
