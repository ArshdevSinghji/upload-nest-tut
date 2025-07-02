import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DeleteFileService } from 'src/delete-file/delete-file.service';
import { Image } from 'src/entity/image.entity';
import { TryAgainService } from 'src/tryagain/tryagain.provider';
import { Repository } from 'typeorm';

@Injectable()
export class PublicMulterService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Image)
    private imageRepo: Repository<Image>,
    private deleteFileService: DeleteFileService,
    private tryAgainService: TryAgainService,
  ) {}

  async handleFileUpload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file uploaded');

    const allowedMimeTypes = ['image/png'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      await this.deleteFileService.deleteFile(file.path);

      throw new BadRequestException('invalid file type');
    }

    const minSize = 7 * 1024;

    if (file.size < minSize) {
      throw new BadRequestException('file is too small!');
    }

    const maxSize = 20 * 1024 * 1024; //20mb

    if (file.size > maxSize) {
      await this.deleteFileService.deleteFile(file.path);

      throw new BadRequestException('file is too large!');
    } else if (file.size > 5 * 1024 * 1024) {
      const uploadedFile = await this.tryAgainService.tryAgain(file);

      await this.deleteFileService.deleteFile(file.path);

      const imageCreated = this.imageRepo.create({
        filename: file.originalname,
        dir: uploadedFile?.url,
      });
      await this.imageRepo.save(imageCreated);

      return {
        uploadedFile: uploadedFile,
        message: 'Image uploaded successfully in cloud!',
      };
    }

    const imageCreated = this.imageRepo.create({
      filename: file.originalname,
      dir: 'http://localhost:3000/' + file.path,
    });
    await this.imageRepo.save(imageCreated);

    return { message: 'File uploaded successfully', filePath: file.path };
  }

  async uploadImageToClient(file: Express.Multer.File) {
    return this.cloudinaryService.uploadImageToCloud(file);
  }
}
