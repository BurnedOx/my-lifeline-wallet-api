import { Controller, Post, UsePipes, Get, Body, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RegistrationDTO, LoginDTO } from './accounts.dto';
import { AuthGuard } from 'src/common/auth.guard';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Get('users')
    @UseGuards(new AuthGuard())
    getAllUsers() {
        return this.accountsService.getAll();
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
}
