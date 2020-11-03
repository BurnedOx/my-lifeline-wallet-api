import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RapidService } from './rapid.service';

@Controller('rapid')
export class RapidController {
    constructor(private readonly rapidService: RapidService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getByUserId(@CustomHeader() headers: HeaderDTO) {
        return this.rapidService.findByUser(headers.userId);
    }
}
