import { Controller, Get, UseGuards, UsePipes, Put, Body, Delete } from '@nestjs/common';
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

    @Get('generate')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    getState() {
        return this.roiService.roiGenerationState;
    }

    @Put('generate')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    toggleState(@Body() state: boolean) {
        this.roiService.roiGenerationState = state;
        return 'ok';
    }

    @Delete()
    @UseGuards(new AuthGuard())
    deleteROI() {
        return this.roiService.deleteAll();
    }
}
