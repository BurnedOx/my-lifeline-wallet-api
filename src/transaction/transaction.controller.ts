import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PagingQuery } from '@common/decorators/common-query-decorator';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { PagingResponse } from '@common/dto/paginated-response.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async getMyTransactions(
    @CustomHeader() headers: HeaderDTO,
    @PagingQuery() query: PagingQueryDTO,
  ): Promise<PagingResponse> {
    const [trx, total] = await this.transactionService.getUserTransactions(
      headers.userId,
      query,
    );
    return new PagingResponse('transactions', trx, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }

  @Get(':id')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async getTransactionsById(
    @Param('id') id: string,
    @PagingQuery() query: PagingQueryDTO,
  ): Promise<PagingResponse> {
    const [trx, total] = await this.transactionService.getUserTransactions(
      id,
      query,
    );
    return new PagingResponse('transactions', trx, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }
}
