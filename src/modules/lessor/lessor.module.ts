import { Module } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { LessorController } from './lessor.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [LessorController],
  providers: [LessorService],
  imports: [UserModule],
})
export class LessorModule {}
