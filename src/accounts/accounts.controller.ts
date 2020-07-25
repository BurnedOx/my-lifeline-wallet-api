import { Controller, Post, UsePipes, Get, Body, UseGuards, Put, Delete, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ValidationPipe } from '../common/validation.pipe';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO, UpdatePasswordDTO, ProfileDTO, BankDTO, AdminProfileDTO } from './accounts.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) { }

    @Get('users')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    getAllUsers() {
        return this.accountsService.getAll();
    }

    @Post('admin/register')
    @UsePipes(new ValidationPipe())
    registerAdmin(@Body() data: AdminRegistrationDTO) {
        return this.accountsService.registerAdmin(data);
    }

    @Post('admin/login')
    @UsePipes(new ValidationPipe())
    loginAdmin(@Body() data: LoginDTO) {
        return this.accountsService.login(data, true);
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
    @UseGuards(JwtAuthGuard)
    getDetails(@CustomHeader() headers: HeaderDTO) {
        return this.accountsService.getDetails(headers.userId);
    }

    @Put('activate')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    activateAccount(@Body('id') id: string, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.activateAccount(id, headers.userId);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    updateProfile(@Body() data: ProfileDTO, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.updateProfile(data, headers.userId);
    }

    @Put('admin/profile')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    updateProfileByAdmin(@Body() data: AdminProfileDTO) {
        const { userId, ...rest } = data;
        return this.accountsService.updateProfile(rest, userId);
    }

    @Put('password')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    changePassword(@Body() data: UpdatePasswordDTO, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.updatePassword(data, headers.userId);
    }

    @Put('admin/password')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    forgotPassword(@Body('userId') userId: string, @Body('password') password: string) {
        return this.accountsService.forgotPassword(userId, password);
    }

    @Put('bank')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    updateBankDetails(@Body() data: BankDTO, @CustomHeader() headers: HeaderDTO) {
        return this.accountsService.updateBankDetails(data, headers.userId);
    }

    @Put('update-sponsor')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    updateSponsor(@Body() data: SponsorUpdateDTO) {
        return this.accountsService.updateSponsor(data);
    }

    @Put('wallet-reset')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    resetWallets() {
        return this.accountsService.resetBalance();
    }

    @Delete(':id')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    deleteUser(@Param('id') id: string) {
        return this.accountsService.deleteUser(id);
    }
}
