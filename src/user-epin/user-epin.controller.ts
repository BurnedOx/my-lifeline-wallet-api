import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RedeemEPinDTO, SendEPinDTO } from './user-epin.dto';
import { UserEpinService } from './user-epin.service';

@Controller('user-epin')
export class UserEpinController {
    constructor(private readonly userEpinService: UserEpinService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getAvailable(@CustomHeader() headers: HeaderDTO, @Query('status') status?: "used" | "unused") {
        return this.userEpinService.getById(headers.userId, status);
    }

    @Put('send')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    sendTo(@CustomHeader() headers: HeaderDTO, @Body() data: SendEPinDTO) {
        return this.userEpinService.sendToAnother(headers.userId, data);
    }

    @Put('use/:id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    activateAccount(@CustomHeader() headers: HeaderDTO, @Param('id') userId: string) {
        return this.userEpinService.activateAccount(headers.userId, userId);
    }

    @Post('send')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    sendByAdmin(@Body() data: SendEPinDTO) {
        return this.userEpinService.sendFromAdmin(data);
    }

    @Post('redeem')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    redeemEpins(@Body() data: RedeemEPinDTO, @CustomHeader() headers: HeaderDTO) {
        return this.userEpinService.redeemEpin(data.count, headers.userId);
    }
}
