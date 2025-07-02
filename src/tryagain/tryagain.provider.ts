import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class TryAgainService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async tryAgain(file: Express.Multer.File, attempts: number = 3) {
    for (let i = 1; i <= attempts; i++) {
      try {
        const uploadedFile = await this.cloudinaryService.uploadImage(file);
        return uploadedFile;
      } catch (err) {
        Logger.log(`Error connecting to cloudinary - retrying...`);
        if (i < attempts)
          await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  }
}
