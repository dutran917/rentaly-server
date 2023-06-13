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
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AdminModule } from './modules/admin/admin.module';
@Module({
  imports: [
    ShareModule,
    UserModule,
    AuthModule,
    PostModule,
    CloudinaryModule,
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
    }),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
