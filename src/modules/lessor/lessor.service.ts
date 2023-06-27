import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import {
  LessorRegisterInput,
  ListApointmentInput,
  UpdateInfoLessorInput,
} from './dto/lessor.dto';
import * as bcrypt from 'bcrypt';
import { APOINT_STATUS } from '@prisma/client';
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

  async handleApointment(input: { status: boolean; id: number }) {
    await this.prisma.apointment.update({
      where: {
        id: +input.id,
      },
      data: {
        status: input.status ? APOINT_STATUS.SUCCESS : APOINT_STATUS.CANCEL,
      },
    });
    return {
      message: 'SUCCESS',
    };
  }

  async updateInfoLessor(lessorId: number, input: UpdateInfoLessorInput) {
    const lessor = await this.prisma.user.findUnique({
      where: {
        id: +lessorId,
      },
    });
    if (!!input.full_name) {
      await this.prisma.user.update({
        where: {
          id: lessor.id,
        },
        data: {
          full_name: input.full_name,
        },
      });
    }
    if (!!input.password && !!input.old_password) {
      const passwordMatch = await bcrypt.compare(
        input.old_password,
        lessor.password,
      );
      if (passwordMatch) {
        const hashPash = await bcrypt.hash(input.password, 10);
        await this.prisma.user.update({
          where: {
            id: lessorId,
          },
          data: {
            password: hashPash,
          },
        });
      } else {
        throw new UnauthorizedException('WRONG_PASSWORD');
      }
    }
    return {
      full_name: input.full_name || lessor.full_name,
      message: 'SUCCESS',
    };
  }
}
