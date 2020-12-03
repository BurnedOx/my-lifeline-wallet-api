import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { PagingQuery } from 'src/common/dto/paging-query.dto';
import { PagingResponse } from 'src/common/dto/paginated-response.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('direct')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  directMembers(@CustomHeader() headers: HeaderDTO) {
    return this.membersService.directMembers(headers.userId);
  }

  @Get(':id/direct')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  adminGetDirect(@Param('id') id: string) {
    return this.membersService.directMembers(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('downline')
  async downlineMembers(
    @CustomHeader() headers: HeaderDTO,
    @Query() query: PagingQuery,
    @Query('status') status?: 'active' | 'inactive',
  ) {
    const [downline, total] = await this.membersService.downlineMembers(
      headers.userId,
      query,
      status,
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
  async adminGetDownline(@Param('id') id: string, @Query() query: PagingQuery) {
    const [downline, total] = await this.membersService.downlineMembers(
      id,
      query,
    );
    return new PagingResponse('members', downline, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }
}
