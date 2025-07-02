import { Inject, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof v2) {}

  async uploadImage(file: Express.Multer.File) {
    return await this.cloudinary.uploader
      .upload(file.path, { folder: 'images' })
      .then((result) => result);
  }

  async uploadImageToCloud(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: 'clientToCloud' },
        (err, res) => {
          if (err) return reject(err);
          resolve(res);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
