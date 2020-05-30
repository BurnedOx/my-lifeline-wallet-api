import { Controller, Post, UsePipes, Get, Body, UseGuards, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ValidationPipe } from '../common/validation.pipe';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO } from './accounts.dto';
import { AuthGuard } from '../common/auth.guard';
import { AwsSnsService } from 'src/aws/services/aws.sns.service';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly smsService: AwsSnsService,
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
    async register(@Body() data: RegistrationDTO) {
        const user = await this.accountsService.register(data);
        this.smsService.sendSMS({
            Message: `
                From VIAZON,\n
                Login link: http://viazon-web.s3-website.us-east-2.amazonaws.com/\n
                Official site: www.viazon.co\n
                Name: ${user.name}\n
                User Id: ${user.id}\n
                Password: ${data.password}
            `,
            Subject: 'Your Viazon Credentials',
            PhoneNumber: `+91${user.mobile}`
        });
        return user;
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: LoginDTO) {
        return this.accountsService.login(data);
    }

    @Put('update-sponsor')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateSponsor(@Body() data: SponsorUpdateDTO) {
        return this.accountsService.updateSponsor(data);
    }

}
