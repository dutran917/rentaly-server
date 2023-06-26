import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import * as crypto from 'crypto';
import { Auth, CurrentUser } from 'src/decorator/auth';
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get('vnpay-return')
  async handleVnpResponse(@Req() req: Request, @Res() res: Response) {
    const result = await this.paymentService.handleVnpResponse(req.query);
    if (result.redirect) {
      res.redirect(result.redirect);
    }
    return result;
  }

  @Auth('user')
  @Get('redirect-vnpay')
  async redirectVNpay(
    @CurrentUser('id') user_id: number,
    @Query()
    input: {
      room_id: number;
      price: number;
      start_time: string;
      end_time: string;
    },
  ) {
    const url = this.paymentService.genRedirectUrl({
      order_id: crypto.randomUUID(),
      description: JSON.stringify({
        user_id,
        ...input,
      }),
      price: +input.price,
      user_id: +user_id,
      start_time: input.start_time,
      end_time: input.end_time,
      room_id: input.room_id,
    });

    return url;
  }
}
