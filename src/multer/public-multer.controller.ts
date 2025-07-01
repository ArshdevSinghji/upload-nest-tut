import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicMulterService } from './public-multer.service';
import { diskStorage, memoryStorage } from 'multer';
import { configDotenv } from 'dotenv';

configDotenv();

@Controller('upload')
export class PublicMulterController {
  constructor(private readonly publicMulterService: PublicMulterService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.MULTER_DEST,
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.publicMulterService.handleFileUpload(file);
  }

  @Post('cloud')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadImageToCloud(@UploadedFile() file: Express.Multer.File) {
    return this.publicMulterService.uploadImageToClient(file);
  }
}
