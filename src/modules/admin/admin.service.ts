import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  ApproveLessorInput,
  CreateLessorInput,
  ListRegisterLessorInput,
  UpdateLessorInput,
} from './dto/manage-lessor.dto';
import { PrismaService } from '../share/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ApproveApartmentInput,
  GetListApartmentInput,
} from './dto/manage-apartment';
import * as moment from 'moment';
import { ListUserInput } from './dto/manager-user';
import { UserService } from '../user/user.service';
import { VERIFY_STATUS, role } from '@prisma/client';
@Injectable()
export class AdminService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}
  async adminApproveLessor(input: ApproveLessorInput) {
    try {
      const lessor = await this.prisma.user.findUnique({
        where: {
          id: +input.lessor_id,
        },
      });
      if (!lessor || lessor.role !== 'lessor') {
        return 'CANNOT FIND ID LESSOR';
      }
      if (input.accept && !!lessor) {
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashPash = await bcrypt.hash(randomPassword, 10);
        await this.prisma.user.update({
          where: {
            id: lessor.id,
          },
          data: {
            password: hashPash,
            verified: 'ACCEPT',
          },
        });
        await this.mailerService.sendMail({
          to: lessor.email,
          subject: 'Xác nhận đăng ký chủ nhà trọ',
          html: `<div>
                  <h1>
                    Chúc mừng bạn đã được xét duyệt trở thành chủ nhà
                    trên Rentaly
                  </h1>
                  <p>
                    Truy cập vào trang quản lý của bạn tại đường link
                    sau:
                  </p>
                  <a
                    href="${this.config.get('CLIENT_PAGE') + '/manager'}"
                    target="_blank"
                    >Trang quản lý nhà trọ</a
                  >
                  <p><b>Tài khoản:</b> Email bạn đã đăng ký</p>
                  <p><b>Mật khẩu:</b>${randomPassword}</p>
                </div>`,
        });
      }
      if (!input.accept && !!lessor) {
        await this.prisma.user.update({
          where: {
            id: lessor.id,
          },
          data: {
            verified: 'REFUSE',
          },
        });
        await this.mailerService.sendMail({
          to: lessor.email,
          subject: 'Từ chối đơn đăng ký',
          html: `<div>
                    Tài khoản của bạn chưa đủ điều kiện để trở thành chủ nhà trọ của Rentaly.
                    <p>Lý do: ${input.reason}</p>
                      <p>Mọi thắc mắc xin liên hệ tại đường dây nóng: <b>0399513456</b></p>
  
                  </div>`,
        });
      }
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async editProfileLessor(input: UpdateLessorInput) {
    const data = {};
    if (!!input.password) {
      const hashPash = await bcrypt.hash(input.password, 10);
      data['password'] = hashPash;
    }
    delete input['password'];
    await this.prisma.user.update({
      where: {
        id: +input.lessorId,
      },
      data: {
        full_name: input.full_name,
        email: input.email,
        phone: input.phone,
        ...data,
      },
    });
    return {
      ...input,
    };
  }

  async getListRegisterLessor(input: ListRegisterLessorInput) {
    let where = {};
    if (!!input.verified) {
      where = {
        verified: input.verified,
      };
    }
    if (!!input.search) {
      where['OR'] = [
        {
          full_name: {
            mode: 'insensitive',
            contains: input.search,
          },
        },
        {
          email: {
            mode: 'insensitive',
            contains: input.search,
          },
        },
        {
          phone: {
            mode: 'insensitive',
            contains: input.search,
          },
        },
      ];
    }
    const [data, total] = [
      await this.prisma.user.findMany({
        where: {
          role: 'lessor',
          ...where,
        },
        include: {
          apartment: true,
        },
        take: Number(input.page_size),
        skip: Number(input.page_size) * Number(input.page_index),
      }),
      await this.prisma.user.count({
        where: {
          role: 'lessor',
          ...where,
        },
      }),
    ];

    return {
      data: data.map((item) => {
        delete item['password'];
        return {
          ...item,
        };
      }),
      total,
    };
  }

  async getListUser(input: ListUserInput) {
    const where = {};
    if (!!input.search) {
      where['OR'] = [
        {
          email: input.search,
        },
        {
          phone: input.search,
        },
        {
          full_name: input.search,
        },
      ];
    }
    const data = await this.prisma.user.findMany({
      where: { ...where, role: 'user' },
      take: +input.page_size,
      skip: +input.page_index * +input.page_size,
      include: {
        RoomRenter: true,
      },
    });
    const total = await this.prisma.user.count({
      where: { ...where, role: 'user' },
    });
    return {
      data: data.map((item) => ({
        id: item.id,
        full_name: item.full_name,
        email: item.email,
        phone: item.phone,
        status: item.status,
        roomRenter: item.RoomRenter,
      })),
      total,
    };
  }

  async getDetailLessor(idLessor: number) {
    const lessor = await this.prisma.user.findUnique({
      where: {
        id: +idLessor,
      },
      select: {
        email: true,
        full_name: true,
        phone: true,
        verified: true,
      },
    });
    const listApartment = await this.prisma.apartment.findMany({
      where: {
        ownerId: +idLessor,
      },
      include: {
        rooms: {
          include: {
            RoomRenter: true,
          },
        },
      },
    });
    const total = await this.prisma.apartment.count({
      where: {
        ownerId: +idLessor,
      },
    });

    const apartments = listApartment.map((item) => ({
      ...item,
      totalIncome: item.rooms.reduce((total, item) => {
        return (
          total +
          item.RoomRenter.reduce((totalRent, rent) => {
            return totalRent + rent.price;
          }, 0)
        );
      }, 0),
    }));
    const lessorIncome = apartments.reduce((total, item) => {
      return total + item.totalIncome;
    }, 0);
    return {
      data: lessor,
      listApartment: apartments,
      lessorIncome: lessorIncome,
      total,
    };
  }

  async getDetailUser(idUser: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +idUser,
      },
      select: {
        email: true,
        full_name: true,
        phone: true,
        verified: true,
        RoomRenter: {
          include: {
            room: {
              include: {
                Apartment: true,
              },
            },
          },
        },
      },
    });

    // const historyRent = await this.userService.getHistoryRent(idUser);

    return {
      data: user,
      historyRent: {
        data: user.RoomRenter,
      },
    };
  }

  async getListApartment(input: GetListApartmentInput) {
    const where = {};
    if (!!input.search) {
      where['address'] = {
        mode: 'insensitive',
        contains: input.search,
      };
    }
    if (!!input.district) {
      where['district'] = input.district;
    }
    if (!!input.verified) {
      where['verified'] = input.verified;
    }
    const data = await this.prisma.apartment.findMany({
      where: {
        ...where,
      },
      include: {
        rooms: {
          include: {
            RoomRenter: true,
          },
        },
      },
      take: +input.page_size,
      skip: +(input.page_size * input.page_index),
    });
    const total = await this.prisma.apartment.count({
      where: {
        ...where,
      },
    });

    return {
      total,
      data: data.map((item) => {
        return {
          ...item,
          rented: item.rooms.filter((room) => {
            if (room.RoomRenter.length > 0) {
              const checkIsRent =
                moment(room.RoomRenter[room.RoomRenter.length - 1].end_at)
                  .toDate()
                  .getTime() > new Date().getTime();
              if (checkIsRent) {
                return room;
              }
            }
          }),
        };
      }),
    };
  }

  async approveApartment(input: ApproveApartmentInput) {
    const apartment = await this.prisma.apartment.findUnique({
      where: {
        id: +input.apartmentId,
      },
    });
    if (!apartment) {
      throw new Error('NOT FOUND APARTMENT');
    }
    if (apartment.verified !== 'PENDING') {
      throw new Error('VERIFIED');
    }
    await this.prisma.apartment.update({
      where: {
        id: apartment.id,
      },
      data: {
        verified: input.approve ? 'ACCEPT' : 'REFUSE',
        published: input.approve ? true : false,
      },
    });
    return {
      message: 'SUCCESS',
    };
  }

  async hideApartment(input: { apartmentId: number; display: boolean }) {
    const { apartmentId, display } = input;
    await this.prisma.apartment.update({
      where: {
        id: +apartmentId,
      },
      data: {
        published: display,
      },
    });
    return {
      message: 'SUCCESS',
    };
  }

  async blockUser(input: { userId: number; status: boolean }) {
    const { userId, status } = input;
    await this.prisma.user.update({
      where: {
        id: +userId,
      },
      data: {
        status: status,
      },
    });
    await this.prisma.apartment.updateMany({
      where: {
        ownerId: +userId,
      },
      data: {
        published: status,
      },
    });
    return {
      message: 'SUCCESS',
    };
  }

  async createLessor(input: CreateLessorInput) {
    try {
      const hashPash = await bcrypt.hash(input.password, 10);
      await this.prisma.user.create({
        data: {
          phone: input.phone,
          email: input.email,
          full_name: input.full_name,
          password: hashPash,
          role: role.lessor,
          verified: VERIFY_STATUS.ACCEPT,
        },
      });
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
