import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Image } from 'src/entity/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicMulterService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Image)
    private imageRepo: Repository<Image>,
  ) {}

  async handleFileUpload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file uploaded');

    const allowedMimeTypes = ['image/png'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      await this.deleteFile(file.path);
      throw new BadRequestException('invalid file type');
    }

    const minSize = 7 * 1024;

    if (file.size < minSize) {
      throw new BadRequestException('file is too small!');
    }

    const maxSize = 20 * 1024 * 1024; //20mb

    if (file.size > maxSize) {
      await this.deleteFile(file.path);
      throw new BadRequestException('file is too large!');
    } else if (file.size > 5 * 1024 * 1024) {
      const uploadedFile = await this.tryAgain(file);

      await this.deleteFile(file.path);

      const imageCreated = this.imageRepo.create({
        filename: file.originalname,
        dir: uploadedFile.url,
      });
      await this.imageRepo.save(imageCreated);

      return {
        uploadedFile: uploadedFile,
        message: 'Image uploaded successfully in cloud!',
      };
    }

    const imageCreated = this.imageRepo.create({
      filename: file.originalname,
      dir: file.path,
    });
    await this.imageRepo.save(imageCreated);

    return { message: 'File uploaded successfully', filePath: file.path };
  }

  async tryAgain(file: Express.Multer.File, maxRetries: number = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `Attempting Cloudinary upload - Try ${attempt}/${maxRetries}`,
        );
        const uploadedFile = await this.cloudinaryService.uploadImage(file);
        return uploadedFile;
      } catch (error) {
        Logger.log(`Error connecting to cloudinary - retrying...`);
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    }
    throw new BadRequestException(`Failed to upload to Cloudinary`);
  }

  async deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async uploadImageToClient(file: Express.Multer.File) {
    return this.cloudinaryService.uploadImageToClient(file);
  }
}
