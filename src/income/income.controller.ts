import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { IncomeService } from './income.service';
import { PagingQuery } from '@common/decorators/common-query-decorator';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { PagingResponse } from '@common/dto/paginated-response.dto';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async getIncomes(
    @CustomHeader() headers: HeaderDTO,
    @PagingQuery() query: PagingQueryDTO,
  ) {
    const [incomes, total] = await this.incomeService.getIncomes(
      headers.userId,
      query,
    );
    return new PagingResponse('incomes', incomes, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }
}
