import { ConfigService } from '@nestjs/config';
import { OrderInfoDto, VnPayPaymentResponse } from './dto/payment.dto';
import { VnPayPaymentImplementor } from './payment.Implementer';
import { Query } from 'express-serve-static-core';
export interface VnPayAdapter {
  generateRedirectUrl(orderInfo: OrderInfoDto): string;
  handleResponse(req: Query): VnPayPaymentResponse;
}

export class VnpPayPaymentFactory {
  public static Build = (config: ConfigService): VnPayAdapter => {
    return new VnPayPaymentImplementor(config);
  };
}
