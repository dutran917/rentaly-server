import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { LessorRegisterInput, ListApointmentInput } from './dto/lessor.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class LessorService {
  constructor(private readonly prisma: PrismaService) {}
  async registerLessor(input: LessorRegisterInput) {
    const { email, password, phone, fullname } = input;
    try {
      const hashPash = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          email,
          phone,
          full_name: fullname,
          password: hashPash,
          role: 'lessor',
        },
      });
      return {
        message: 'REGISTER SUCCESS',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getListApointment(userId: number, input: ListApointmentInput) {
    const { page_index, page_size, apartmentId, time_end, time_start } = input;
    const where = {};
    if (!!time_end && !!time_start)
      where['date'] = {
        gte: time_start,
        lte: time_end,
      };
    if (!!apartmentId) {
      where['apartmentId'] = +apartmentId;
    }
    try {
      if (!!apartmentId) {
        const apartment = await this.prisma.apartment.findUnique({
          where: {
            id: +apartmentId,
          },
        });
        if (apartment.ownerId !== +userId) {
          throw new Error('INVALID_APARTMENT_ID');
        }
      }
      const apointmnet = await this.prisma.apointment.findMany({
        where: {
          ...where,
          Apartment: {
            ownerId: +userId,
          },
        },
        include: {
          room: true,
          Apartment: true,
        },
        take: +page_size,
        skip: +(page_index * page_size),
      });
      const total = await this.prisma.apointment.count({
        where: {
          ...where,
          Apartment: {
            ownerId: +userId,
          },
        },
      });
      return {
        data: apointmnet.map((item) => ({
          ...item,
          room: item.room.title,
          apartment: item.Apartment.title,
        })),
        total,
      };
    } catch (error) {
      throw error;
    }
  }
}
