import { Controller, Post, UsePipes, Get, Body, UseGuards, Put, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ValidationPipe } from '../common/validation.pipe';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO, UpdatePasswordDTO, ProfileDTO } from './accounts.dto';
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

    @Put('profile')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateProfile(@Body() data: ProfileDTO, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.updateProfile(data, headers.userId);
    }

    @Put('password')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    changePassword(@Body() data: UpdatePasswordDTO, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.updatePassword(data, headers.userId);
    }

    @Put('update-sponsor')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateSponsor(@Body() data: SponsorUpdateDTO) {
        return this.accountsService.updateSponsor(data);
    }

    @Put('wallet-reset')
    @UseGuards()
    resetWallets() {
        return this.accountsService.resetBalance();
    }
}
