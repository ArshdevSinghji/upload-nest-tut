import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicMulterService } from './public-multer.service';
import { diskStorage, memoryStorage } from 'multer';
import { configDotenv } from 'dotenv';
import { MinFileSizeValidator } from './minFileSize.validator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

configDotenv();

@Controller('upload')
export class PublicMulterController {
  constructor(
    private readonly publicMulterService: PublicMulterService,
    private cloudinaryService: CloudinaryService,
  ) {}

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

  @Post('cloud-proxy-signed')
  async uploadDirectSigned(@Req() req, @Res() res) {
    const formData = new FormData();

    if (!process.env.CLOUDINARY_API_KEY)
      throw new UnauthorizedException(
        'You are not authroized to access this route',
      );

    formData.append('api_key', process.env.CLOUDINARY_API_KEY);
    formData.append('timestamp', Math.round(Date.now() / 1000).toString());

    // Copy file and other data
    for (const [key, value] of Object.entries(req.body)) {
      formData.append(key, String(value));
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload

`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const result = await response.json();
    res.json(result);
  }
}
