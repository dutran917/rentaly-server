import { BadRequestException, Injectable } from '@nestjs/common';
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

  async genRedirectUrl(data: OrderInfoDto) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: Number(data?.room_id),
        },
        include: {
          RoomRenter: true,
          Apartment: true,
        },
      });
      if (
        !!room &&
        moment(data?.start_time).add(7, 'd').toDate().getTime() <
          moment(room.RoomRenter[room.RoomRenter?.length - 1]?.end_at)
            .toDate()
            .getTime()
      ) {
        throw new BadRequestException('Phòng đã được thuê');
      }
      return this.vnPayGateway.generateRedirectUrl(data);
    } catch (error) {
      throw error;
    }
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
      if (code == '00') {
        const handleRent = this.prisma.roomRenter.create({
          data: {
            user_id: Number(orderInfo?.user_id),
            room_id: Number(orderInfo?.room_id),
            price: Number(orderInfo?.price),
            start_at: orderInfo?.start_time,
            end_at: orderInfo?.end_time,
          },
        });
        const hide = this.prisma.room.update({
          where: {
            id: Number(orderInfo?.room_id),
          },
          data: {
            display: false,
          },
        });
        await this.prisma.$transaction([handleRent, hide]);
        return {
          status,
          message,
          redirect: `${process.env.CLIENT_PAGE}/user/rental-management`,
        };
      }

      return {
        status: false,
        message: 'Đã hủy giao dịch',
        redirect: `${process.env.CLIENT_PAGE}/rental`,
      };
    } catch (error) {
      throw error;
    }
  }
}
