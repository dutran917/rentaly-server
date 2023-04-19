import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
interface UploadResult {
  name: string;
  path: string;
  image: string;
}
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinary: CloudinaryService) {}
  @Post('multi')
  @UseInterceptors(FilesInterceptor('files', 5, {}))
  async uploadMultiFile(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResult[]> {
    const cloudFiles = await Promise.all(
      files.map((file) => this.cloudinary.uploadFile(file)),
    );
    const filesImage = [];
    for (let i = 0; i < cloudFiles.length; i++) {
      const file = cloudFiles[i];
      if (file.format === 'pdf') {
        const imagePath = this.cloudinary.getPDFImage(file.public_id);
        filesImage.push(imagePath);
        continue;
      }
      filesImage.push(file.url);
    }
    return cloudFiles.map((file, index) => ({
      name: files[index].originalname,
      path: file.url,
      image: filesImage[index],
    }));
  }
}
