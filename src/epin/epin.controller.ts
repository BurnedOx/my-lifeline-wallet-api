import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Put,
  Body,
  UsePipes,
  Query,
} from '@nestjs/common';
import { EpinService } from './epin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { PagingQuery } from '@common/decorators/common-query-decorator';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { PagingResponse } from '@common/dto/paginated-response.dto';

@Controller('epin')
export class EpinController {
  constructor(private readonly epinService: EpinService) {}

  @Get()
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async getAll(
    @PagingQuery() query: PagingQueryDTO,
    @Query('status') status?: 'used' | 'unused',
  ): Promise<PagingResponse> {
    const [epins, total] = await this.epinService.getAll(query, status);
    return new PagingResponse('epins', epins, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  getEpin(@CustomHeader() headers: HeaderDTO) {
    return this.epinService.getEpin(headers.userId);
  }

  @Post()
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  generate() {
    return this.epinService.generate();
  }
}
