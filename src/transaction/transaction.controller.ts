import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';

@Controller('transaction')
export class TransactionController {

    constructor (private readonly transactionService: TransactionService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getMyTransactions(@CustomHeader() headers: HeaderDTO) {
        return this.transactionService.getUserTransactions(headers.userId);
    }
}
