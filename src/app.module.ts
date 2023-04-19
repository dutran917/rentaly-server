import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './modules/share/share.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [ShareModule, UserModule, AuthModule, PostModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
