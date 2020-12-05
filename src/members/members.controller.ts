import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '@common/guards/jwt.guard';
import { ValidationPipe } from '@common/validation.pipe';
import { CustomHeader } from '@common/decorators/common-header-decorator';
import { HeaderDTO } from '@common/dto/base-header.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { hasRoles } from '@common/decorators/roles-decorator';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { PagingResponse } from '@common/dto/paginated-response.dto';
import { PagingQuery } from '@common/decorators/common-query-decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('direct')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async directMembers(
    @CustomHeader() headers: HeaderDTO,
    @PagingQuery() query: PagingQueryDTO,
    @Query('status') status?: 'active' | 'inactive',
    @Query('search') search?: string,
  ): Promise<PagingResponse> {
    const [direct, total] = await this.membersService.directMembers(headers.userId, query, status, search);
    return new PagingResponse('members', direct, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }

  @Get(':id/direct')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async adminGetDirect(
    @Param('id') id: string,
    @PagingQuery() query: PagingQueryDTO,
    @Query('status') status?: 'active' | 'inactive',
    @Query('search') search?: string,
  ) {
    const [direct, total] = await this.membersService.directMembers(id, query, status, search);
    return new PagingResponse('members', direct, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }

  @Get('downline')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async downlineMembers(
    @CustomHeader() headers: HeaderDTO,
    @PagingQuery() query: PagingQueryDTO,
    @Query('status') status?: 'active' | 'inactive',
    @Query('search') search?: string,
    ): Promise<PagingResponse> {
    const [downline, total] = await this.membersService.downlineMembers(
      headers.userId,
      query,
      status,
      search
    );

    return new PagingResponse('members', downline, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }

  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @Get(':id/downline')
  async adminGetDownline(
    @Param('id') id: string,
    @PagingQuery() query: PagingQueryDTO,
    @Query('status') status?: 'active' | 'inactive',
    @Query('search') search?: string,
    ) {
    const [downline, total] = await this.membersService.downlineMembers(
      id,
      query,
      status,
      search,
    );
    return new PagingResponse('members', downline, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }
}
