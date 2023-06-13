import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ApproveLessorInput } from './dto/manage-lessor.dto';
import { PrismaService } from '../share/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}
  async adminApproveLessor(input: ApproveLessorInput) {
    try {
      const lessor = await this.prisma.user.findUnique({
        where: {
          id: +input.lessor_id,
        },
      });
      if (!lessor) {
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
            verified: true,
          },
        });
        await this.mailerService.sendMail({
          to: input.email,
          from: 'rentaly@gmail.com',
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
                    href="http://localhost:3000/manager"
                    target="_blank"
                    >Trang quản lý nhà trọ</a
                  >
                  <p><b>Tài khoản:</b> Email bạn đã đăng ký</p>
                  <p><b>Mật khẩu:</b>${randomPassword}}</p>
                </div>`,
        });
      }
      if (!input.accept && !!lessor) {
        await this.mailerService.sendMail({
          to: input.email,
          from: 'rentaly@gmail.com',
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
}
