import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [UploadController],
  providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
