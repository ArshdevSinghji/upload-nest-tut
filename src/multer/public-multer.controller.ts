import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicMulterService } from './public-multer.service';
import { diskStorage, memoryStorage } from 'multer';
import { configDotenv } from 'dotenv';
import { MinFileSizeValidator } from './minFileSize.validator';

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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MinFileSizeValidator({
            minSize: 7 * 1024,
            message: 'File size must be atleast 7kb',
          }),
          new MaxFileSizeValidator({
            maxSize: 20 * 1024 * 1024,
            message: 'File size must not exceed 20mb',
          }),
          // new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
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
