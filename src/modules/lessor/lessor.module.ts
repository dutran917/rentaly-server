import { Module } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { LessorController } from './lessor.controller';

@Module({
  controllers: [LessorController],
  providers: [LessorService]
})
export class LessorModule {}
