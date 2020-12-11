import { CustomHeader } from '@common/decorators/common-header-decorator';
import { PagingQuery } from '@common/decorators/common-query-decorator';
import { CustomBody } from '@common/decorators/custom-body-decorator';
import { hasRoles } from '@common/decorators/roles-decorator';
import { HeaderDTO } from '@common/dto/base-header.dto';
import { PagingResponse } from '@common/dto/paginated-response.dto';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { JwtAuthGuard } from '@common/guards/jwt.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { ValidationPipe } from '@common/validation.pipe';
import { Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateTaskDTO } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async getTasks(
    @CustomHeader() headers: HeaderDTO,
    @PagingQuery() query: PagingQueryDTO,
  ) {
    const [tasks, total] = await this.taskService.get(headers.userId, query);
    return new PagingResponse('tasks', tasks, {
      limit: query.limit,
      offset: query.offset,
      total,
    });
  }

  @Post()
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  createNew(@CustomBody(CreateTaskDTO) data: CreateTaskDTO) {
    return this.taskService.create(data);
  }
}
