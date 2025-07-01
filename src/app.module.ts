import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicMulterModule } from './multer/public-multer.module';
import { dataSourceOptions } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return dataSourceOptions;
      },
    }),
    PublicMulterModule,
  ],
})
export class AppModule {}
