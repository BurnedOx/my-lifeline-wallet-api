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
  getAll(@CustomHeader() headers: HeaderDTO) {
    return this.epinHistoryService.getAll(headers.userId);
  }

  @Get('admin')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  getAdminHistory() {
    return this.epinHistoryService.getAdminHistory();
  }
}
