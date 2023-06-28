import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { UserLoginInput, UserRegisterInput } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(input: UserRegisterInput) {
    try {
      // if (input.role === 'admin') {
      //   throw new BadRequestException('CANNOT_CREATE');
      // }
      const hashPash = await bcrypt.hash(input.password, 10);
      await this.prisma.user.create({
        data: {
          ...input,
          password: hashPash,
          role: input.role,
        },
      });
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('CANNOT_CREATE');
    }
  }

  async userUpdateProfile(
    userId: number,
    input: { full_name?: string; phone?: string },
  ) {
    const data = {};
    if (!!input.full_name) {
      data['full_name'] = input.full_name;
    }
    if (!!input.phone) {
      data['phone'] = input.phone;
    }
    try {
      await this.prisma.user.update({
        where: {
          id: +userId,
        },
        data: {
          ...data,
        },
      });
      return {
        ...input,
      };
    } catch (error) {
      throw new BadRequestException('PHONE_EXISTED');
    }
  }

  async getInfoUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: +userId,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getHistoryRent(userId: number) {
    const history = await this.prisma.roomRenter.findMany({
      where: {
        user_id: +userId,
      },
      distinct: ['room_id'],
      include: {
        room: {
          include: {
            Apartment: true,
          },
        },
      },
      orderBy: {
        end_at: 'desc',
      },
    });
    const currentDate = new Date();
    return {
      data: history.map((item) => {
        let status;
        if (moment(item.end_at).toDate().getTime() > currentDate.getTime()) {
          status = 'RENTING';
          if (
            moment(item.end_at).subtract(10, 'd').toDate().getTime() <
            currentDate.getTime()
          ) {
            status = 'EXPIRED_SOON';
          }
        }
        if (moment(item.end_at).toDate().getTime() <= currentDate.getTime()) {
          status = 'OUT_DATE';
        }

        return {
          ...item,
          status: status,
        };
      }),
    };
  }

  async getApointment(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const data = await this.prisma.apointment.findMany({
      where: {
        phone: user.phone,
      },
      include: {
        room: true,
        Apartment: true,
      },
    });
    const total = await this.prisma.apointment.count({
      where: {
        phone: user.phone,
      },
    });
    return {
      data,
      total,
    };
  }

  async userCreatePost(input: UserLoginInput) {}
}
