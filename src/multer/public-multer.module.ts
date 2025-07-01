import { Module } from '@nestjs/common';
import { PublicMulterController } from './public-multer.controller';
import { PublicMulterService } from './public-multer.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), ConfigModule, CloudinaryModule],
  controllers: [PublicMulterController],
  providers: [PublicMulterService],
  exports: [PublicMulterService],
})
export class PublicMulterModule {}
