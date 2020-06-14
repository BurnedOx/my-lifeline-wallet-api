import { Controller, Post, UsePipes, Get, Body, UseGuards, Put, Delete, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ValidationPipe } from '../common/validation.pipe';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO, UpdatePasswordDTO, ProfileDTO, BankDTO } from './accounts.dto';
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

    @Get('details')
    @UseGuards(new AuthGuard())
    getDetails(@CustomHeader() headers: HeaderDTO) {
        return this.accountsService.getDetails(headers.userId);
    }

    @Put('activate')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    activateAccount(@Body('id') id: string, @CustomHeader() headers: HeaderDTO) {
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

    @Put('bank')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateBankDetails(@Body() data: BankDTO, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.updateBankDetails(data, headers.userId);
    }

    @Put('update-sponsor')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateSponsor(@Body() data: SponsorUpdateDTO) {
        return this.accountsService.updateSponsor(data);
    }

    @Put('wallet-reset')
    @UseGuards(new AuthGuard())
    resetWallets() {
        return this.accountsService.resetBalance();
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    deleteUser(@Param('id') id: string) {
        return this.accountsService.deleteUser(id);
    }
}
