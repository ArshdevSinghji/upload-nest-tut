import { Module } from '@nestjs/common';
import { PublicMulterController } from './public-multer.controller';
import { PublicMulterService } from './public-multer.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const destination = configService.get<string>('MULTER_DEST');
        return {
          storage: diskStorage({
            destination,
            filename: (req, file, cb) => {
              const filename = `${Date.now()}-${file.originalname}`;
              cb(null, filename);
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
    CloudinaryModule,
  ],
  controllers: [PublicMulterController],
  providers: [PublicMulterService],
  exports: [PublicMulterService],
})
export class PublicMulterModule {}
