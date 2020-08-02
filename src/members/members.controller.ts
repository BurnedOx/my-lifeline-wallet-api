import { Controller, Get, UseGuards, UsePipes, Put, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { hasRoles } from 'src/common/decorators/roles-decorator';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

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

    @Get('downline')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    downlineMembers(@CustomHeader() headers: HeaderDTO) {
        return this.membersService.downlineMembers(headers.userId);
    }

    @Get('single-leg')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    singleLegMembers(@CustomHeader() headers: HeaderDTO) {
        return this.membersService.singleLegMembers(headers.userId);
    }

    @Get(':id/single-leg')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    getAdminSingleLeg(@Param('id') id: string) {
        return this.membersService.singleLegMembers(id);
    }

    @Put('update-single-leg')
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    updateSingleLeg() {
        return this.membersService.updateSingleLeg();
    }
}
