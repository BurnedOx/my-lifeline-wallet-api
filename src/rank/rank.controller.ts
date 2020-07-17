import { Controller, Post, UseGuards, UsePipes, Body, Get } from '@nestjs/common';
import { RankService } from './rank.service';
import { AuthGuard } from 'src/common/auth.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RankDTO } from './rank.dto';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';

@Controller('rank')
export class RankController {
    constructor(private readonly rankService: RankService) { }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createRank(@Body() data: RankDTO) {
        return this.rankService.createRank(data);
    }

    @Get()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    getRanks(@CustomHeader() headers: HeaderDTO) {
        return this.rankService.getRanks(headers.userId);
    }
}
