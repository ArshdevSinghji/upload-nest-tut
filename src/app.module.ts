import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicMulterModule } from './multer/public-multer.module';
import { dataSourceOptions } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteFileModule } from './delete-file/delete-file.module';
import { TryagainModule } from './tryagain/tryagain.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/upload/files'),
      serveRoot: '/upload/files/',
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
