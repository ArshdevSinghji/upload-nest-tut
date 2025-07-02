import { Module } from '@nestjs/common';
import { PublicMulterController } from './public-multer.controller';
import { PublicMulterService } from './public-multer.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';
import { DeleteFileModule } from 'src/delete-file/delete-file.module';
import { TryagainModule } from 'src/tryagain/tryagain.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ConfigModule,
    CloudinaryModule,
    DeleteFileModule,
    TryagainModule,
  ],
  controllers: [PublicMulterController],
  providers: [PublicMulterService],
  exports: [PublicMulterService],
})
export class PublicMulterModule {}
