import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicMulterModule } from './multer/public-multer.module';
import { dataSourceOptions } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteFileModule } from './delete-file/delete-file.module';
import { TryagainModule } from './tryagain/tryagain.module';

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
    DeleteFileModule,
    TryagainModule,
  ],
})
export class AppModule {}
