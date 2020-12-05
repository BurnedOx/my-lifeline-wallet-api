import { PagingQuery } from '@common/decorators/common-query-decorator';
import { PagingResponse } from '@common/dto/paginated-response.dto';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { EpinHistoryService } from './epin-history.service';

@Controller('epin-history')
export class EpinHistoryController {
  constructor(private readonly epinHistoryService: EpinHistoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async getAll(
    @CustomHeader() headers: HeaderDTO,
    @PagingQuery() query: PagingQueryDTO,
  ): Promise<PagingResponse> {
    const [trx, total] = await this.epinHistoryService.getAll(
      headers.userId,
      query,
    );
    return new PagingResponse('epins', trx, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }

  @Get('admin')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async getAdminHistory(
    @PagingQuery() query: PagingQueryDTO,
  ): Promise<PagingResponse> {
    const [trx, total] = await this.epinHistoryService.getAdminHistory(query);
    return new PagingResponse('epins', trx, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }
}
