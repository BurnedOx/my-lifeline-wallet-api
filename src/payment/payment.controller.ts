import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CustomHeader, RazorpayHeader } from 'src/common/decorators/common-header-decorator';
import { HeaderDTO, RazorpayHeaderDTO } from 'src/common/dto/base-header.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { EpinPurchaseDTO } from './payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('activation')
    @UseGuards(JwtAuthGuard)
    payForActivation(@CustomHeader() headers: HeaderDTO) {
        return this.paymentService.payForPaytmActivation(headers.userId);
    }

    // @Post('epins')
    // @UseGuards(JwtAuthGuard)
    // payForEpins(@CustomHeader() headers: HeaderDTO, @Body() data: EpinPurchaseDTO) {
    //     return this.paymentService.payForEpins(headers.userId, data.count);
    // }
    //
    // @Post('verification')
    // verify(@Body() data: any,  @RazorpayHeader() headers: RazorpayHeaderDTO) {
    //     return this.paymentService.verifyPayment(headers.razorpaySignature, data);
    // }
}
