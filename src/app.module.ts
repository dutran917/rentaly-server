import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './modules/share/share.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { RentalModule } from './modules/rental/rental.module';
import { ConfigModule } from '@nestjs/config';
import { LessorModule } from './modules/lessor/lessor.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentModule } from './modules/payment/payment.module';
@Module({
  imports: [
    ShareModule,
    UserModule,
    AuthModule,
    PostModule,
    CloudinaryModule,
    PaymentModule,
    RentalModule,
    ConfigModule,
    LessorModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `"Rentaly" <${process.env.MAIL_FROM}>`,
      },
    }),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
