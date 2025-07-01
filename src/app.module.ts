import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicMulterModule } from './multer/public-multer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PublicMulterModule,
  ],
})
export class AppModule {}
