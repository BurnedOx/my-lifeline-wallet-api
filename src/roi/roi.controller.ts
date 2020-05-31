import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { RoiService } from './roi.service';
import { AuthGuard } from 'src/common/auth.guard';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';

@Controller('roi')
export class RoiController {
    constructor(private readonly roiService: RoiService) {}

    @Get()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    getMyROI(@CustomHeader() header: HeaderDTO) {
        return this.roiService.getMy(header.userId);
    }
}
