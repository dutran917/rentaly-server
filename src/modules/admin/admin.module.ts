import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { LessorModule } from '../lessor/lessor.module';
import { PostModule } from '../post/post.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [UserModule, LessorModule, PostModule],
})
export class AdminModule {}
