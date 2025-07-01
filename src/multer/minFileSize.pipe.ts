import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MinFileSizePipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    // console.log('File size: ', value.size / (1024 * 1024));
    // console.log('metadata: ', metadata);
    if (value.size < 7 * 1024)
      throw new BadRequestException('file should be atleast 7kb.');
    return value;
  }
}
