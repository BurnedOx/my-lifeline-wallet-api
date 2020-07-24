import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { IncomeService } from './income.service';

@Controller('income')
export class IncomeController {
    constructor(private readonly incomeService: IncomeService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getIncomes(@CustomHeader() headers: HeaderDTO) {
        return this.incomeService.getIncomes(headers.userId);
    }
}
