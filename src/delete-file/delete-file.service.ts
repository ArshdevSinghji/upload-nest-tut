import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class DeleteFileService {
  async deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
