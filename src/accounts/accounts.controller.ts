import { Controller, Post, UsePipes, Get, Body, UseGuards, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ValidationPipe } from '../common/validation.pipe';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO } from './accounts.dto';
import { AuthGuard } from '../common/auth.guard';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) { }

    @Get('users')
    @UseGuards(new AuthGuard())
    getAllUsers() {
        return this.accountsService.getAll();
    }

    @Post('admin/register')
    @UsePipes(new ValidationPipe())
    registerAdmin(@Body() data: AdminRegistrationDTO) {
        return this.accountsService.registerAdmin(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: RegistrationDTO) {
        return this.accountsService.register(data);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: LoginDTO) {
        return this.accountsService.login(data);
    }

    @Put('activate')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    activateAccount(@Body() id: string, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.activateAccount(id, headers.userId);
    }

    @Put('update-sponsor')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateSponsor(@Body() data: SponsorUpdateDTO) {
        return this.accountsService.updateSponsor(data);
    }

    @Put('update-activation')
    updateActivation(@CustomHeader() header: HeaderDTO) {
        return this.accountsService.updateActivation(header.userId);
    }
}
