import { Controller, Post, UseGuards, UsePipes, Body, Get } from '@nestjs/common';
import { RankService } from './rank.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RankDTO } from './rank.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { hasRoles } from 'src/common/decorators/roles-decorator';

@Controller('rank')
export class RankController {
    constructor(private readonly rankService: RankService) { }

    @Post()
    @hasRoles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    createRank(@Body() data: RankDTO) {
        return this.rankService.createRank(data);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getRanks(@CustomHeader() headers: HeaderDTO) {
        return this.rankService.getRanks(headers.userId);
    }
}
