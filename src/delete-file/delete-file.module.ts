import { Module } from '@nestjs/common';
import { DeleteFileService } from './delete-file.service';

@Module({
  providers: [DeleteFileService],
  exports: [DeleteFileService],
})
export class DeleteFileModule {}
