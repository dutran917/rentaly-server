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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
