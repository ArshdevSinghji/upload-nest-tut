import { BadRequestException, FileValidator } from '@nestjs/common';

export class MinFileSizeValidator extends FileValidator {
  constructor(
    protected readonly validationOptions: {
      minSize: number;
      message?: string;
    },
  ) {
    super(validationOptions);
  }

  isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
    if (!file) throw new BadRequestException('file is missing!');
    return file.size >= this.validationOptions.minSize;
  }
  buildErrorMessage(file: any): string {
    return (
      this.validationOptions.message ||
      `File size must be at least ${this.validationOptions.minSize} bytes`
    );
  }
}
