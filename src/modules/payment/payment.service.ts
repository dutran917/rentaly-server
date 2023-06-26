import { Injectable } from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { VnPayAdapter, VnpPayPaymentFactory } from './payment.provider';
import { ConfigService } from '@nestjs/config';
import { OrderInfoDto } from './dto/payment.dto';

import { PrismaService } from '../share/prisma.service';
import * as moment from 'moment';
@Injectable()
export class PaymentService {
  private vnPayGateway: VnPayAdapter;
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.vnPayGateway = VnpPayPaymentFactory.Build(this.config);
  }

  genRedirectUrl(data: OrderInfoDto) {
    return this.vnPayGateway.generateRedirectUrl(data);
  }
  async handleVnpResponse(data: Query) {
    // console.log(data);
    try {
      const res = JSON.parse(JSON.stringify(data));
      const orderInfo = JSON.parse(res?.vnp_OrderInfo);
      console.log(orderInfo, typeof orderInfo);

      const { order_id, status, amount, code, message } =
        this.vnPayGateway.handleResponse(data);

      const room = await this.prisma.room.findUnique({
        where: {
          id: Number(orderInfo?.room_id),
        },
        include: {
          RoomRenter: true,
          Apartment: true,
        },
      });
      if (
        !!room &&
        moment(orderInfo?.start_at).add(7, 'd').toDate().getTime() <
          moment(room.RoomRenter[room.RoomRenter?.length - 1]?.end_at)
            .toDate()
            .getTime()
      ) {
        throw new Error('ROOM ALREADY RENTED');
      }
      const handleRent = this.prisma.roomRenter.create({
        data: {
          user_id: Number(orderInfo?.user_id),
          room_id: Number(orderInfo?.room_id),
          price: Number(orderInfo?.price),
          start_at: orderInfo?.start_time,
          end_at: orderInfo?.end_time,
        },
      });
      await this.prisma.$transaction([handleRent]);
      return {
        status,
        message,
        redirect: `http://localhost:3000/user/rental-management`,
      };
    } catch (error) {
      throw error;
    }
  }
}
