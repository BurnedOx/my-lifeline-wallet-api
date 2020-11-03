import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('transaction')
export class TransactionController {

    constructor (private readonly transactionService: TransactionService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getMyTransactions(@CustomHeader() headers: HeaderDTO) {
        return this.transactionService.getUserTransactions(headers.userId);
    }

    @Get(':id')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    getTransactionsById(@Param('id') id: string) {
        return this.transactionService.getUserTransactions(id);
    }
}
