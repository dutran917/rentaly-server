import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  ApproveLessorInput,
  ListRegisterLessorInput,
} from './dto/manage-lessor.dto';
import { PrismaService } from '../share/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ApproveApartmentInput,
  GetListApartmentInput,
} from './dto/manage-apartment';
@Injectable()
export class AdminService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
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

  async getListRegisterLessor(input: ListRegisterLessorInput) {
    let where = {};
    if (!!input.verified) {
      where = {
        verified: input.verified,
      };
    }
    const [data, total] = [
      await this.prisma.user.findMany({
        where: {
          role: 'lessor',
          ...where,
        },
        take: +input.page_size,
        skip: +(input.page_size * input.page_index),
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

  async getDetailLessor(idLessor: number) {
    const lessor = await this.prisma.user.findUnique({
      where: {
        id: +idLessor,
      },
      include: {
        apartment: {
          include: {
            rooms: true,
          },
        },
      },
    });
    return {
      data: lessor,
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
    const data = this.prisma.apartment.findMany({
      where: {
        ...where,
      },
      include: {
        rooms: true,
      },
      take: +input.page_size,
      skip: +(input.page_size * input.page_index),
    });
    const total = this.prisma.apartment.count({
      where: {
        ...where,
      },
    });

    return {
      data,
      total,
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
      },
    });
    return {
      message: 'SUCCESS',
    };
  }
}
