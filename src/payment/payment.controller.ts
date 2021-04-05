import { Controller, Post, UseGuards } from '@nestjs/common';
import { CustomHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('activation')
  @UseGuards(JwtAuthGuard)
  payForActivation(@CustomHeader() headers: HeaderDTO) {
    return this.paymentService.payForActivation(headers.userId);
  }
}
