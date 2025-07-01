import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicMulterService } from './public-multer.service';

@Controller('upload')
export class PublicMulterController {
  constructor(private readonly publicMulterService: PublicMulterService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.publicMulterService.handleFileUpload(file);
  }
}
