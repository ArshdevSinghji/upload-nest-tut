import { BadRequestException, Injectable } from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PublicMulterService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async handleFileUpload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file uploaded');

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    const minSize = 7 * 1024;
    if (file.size < minSize) {
      throw new BadRequestException('file is too small!');
    }

    const maxSize = 20 * 1024 * 1024; //20mb
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    } else if (file.size > 5 * 1024 * 1024) {
      const uploadedFile = await this.cloudinaryService.uploadImage(file);
      await unlink(file.path);
      return {
        uploadedFile: uploadedFile,
        message: 'Image uploaded successfully in cloud!',
      };
    }

    return { message: 'File uploaded successfully', filePath: file.path };
  }
}
