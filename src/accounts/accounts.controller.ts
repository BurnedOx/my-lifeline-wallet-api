import {
  Controller,
  Post,
  UsePipes,
  Get,
  Body,
  UseGuards,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ValidationPipe } from '../common/validation.pipe';
import {
  RegistrationDTO,
  LoginDTO,
  AdminRegistrationDTO,
  UpdatePasswordDTO,
  ProfileDTO,
  BankDTO,
  WalletDTO,
} from './accounts.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('users')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllUsers(
    @Query('status') status?: 'active' | 'inactive' | 'all',
    @Query('wallet') walletStr?: string,
  ) {
    let [min, max] = walletStr?.split(',')?.map(val => parseInt(val)) ?? [
      undefined,
      undefined,
    ];
    let wallet: any = undefined;
    if (min !== undefined && max !== undefined) {
      wallet = { min, max };
    }
    return this.accountsService.getAll({ status, wallet });
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Get('name/:id')
  @UsePipes(new ValidationPipe())
  getName(@Param('id') id: string) {
    return this.accountsService.getName(id);
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

  @Get('details/:id')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  getDetailsByAdmin(@Param('id') id: string) {
    return this.accountsService.getDetails(id);
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

  @Put('profile/:id')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  updateProfileByAdmin(@Body() data: ProfileDTO, @Param('id') userId: string) {
    return this.accountsService.updateProfile(data, userId);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  changePassword(
    @Body() data: UpdatePasswordDTO,
    @CustomHeader() headers: HeaderDTO,
  ) {
    return this.accountsService.updatePassword(data, headers.userId);
  }

  @Put('password/:id')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  forgotPassword(
    @Param('id') userId: string,
    @Body('password') password: string,
  ) {
    return this.accountsService.forgotPassword(userId, password);
  }

  @Put('bank')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateBankDetails(@Body() data: BankDTO, @CustomHeader() headers: HeaderDTO) {
    return this.accountsService.updateBankDetails(data, headers.userId);
  }

  @Put('bank/:id')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  updateBankDetailsByAdmin(@Param('id') id: string, @Body() data: BankDTO) {
    return this.accountsService.updateBankDetails(data, id);
  }

  @Put('update-sponsor/:id')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  updateSponsor(@Body('sponsorId') sponsorId: string, @Param('id') id: string) {
    return this.accountsService.updateSponsor(id, sponsorId);
  }

  @Put('wallet-reset')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  resetWallets() {
    return this.accountsService.resetBalance();
  }

  @Put('credit-wallet')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  creditUser(@Body() data: WalletDTO) {
    return this.accountsService.creditBalance(data.userId, data.amount);
  }

  @Put('debit-wallet')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  debitUser(@Body() data: WalletDTO) {
    return this.accountsService.debitBalance(data.userId, data.amount);
  }

  @Delete(':id')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  deleteUser(@Param('id') id: string) {
    return this.accountsService.deleteUser(id);
  }
}
