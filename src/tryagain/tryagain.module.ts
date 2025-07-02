import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TryAgainService } from './tryagain.provider';

@Module({
  imports: [CloudinaryModule],
  providers: [TryAgainService],
  exports: [TryAgainService],
})
export class TryagainModule {}
