import { Controller, Post, UseGuards, UsePipes, Body } from '@nestjs/common';
import { RankService } from './rank.service';
import { AuthGuard } from 'src/common/auth.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RankDTO } from './rank.dto';

@Controller('rank')
export class RankController {
    constructor(private readonly rankService: RankService) { }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createRank(@Body() data: RankDTO) {
        return this.rankService.createRank(data);
    }
}
