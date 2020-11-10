import { Controller, Get, UseGuards } from '@nestjs/common';
import { hasRoles } from 'src/common/decorators/roles-decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @hasRoles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAdminDash() {
    return this.dashboardService.getAdminDash();
  }
}
