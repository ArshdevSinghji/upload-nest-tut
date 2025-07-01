import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File) {
    return await v2.uploader
      .upload(file.path, { folder: 'images' })
      .then((result) => result);
  }
}
