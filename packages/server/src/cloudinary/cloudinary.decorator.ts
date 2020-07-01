import { Body, Inject, PipeTransform } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadFile } from '@fullstack/typings';

export class CloudinaryPipe implements PipeTransform {
  constructor(
    @Inject(CloudinaryService)
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async transform(value: UploadFile): Promise<unknown> {
    if (typeof value === 'string' || value === null) return value;
    if (typeof value === 'object' && 'path' in value) {
      return this.cloudinaryService
        .upload(value)
        .then(response => response.map(data => data.secure_url));
    }
  }
}

export const Cloudinary = (fieldName: string): ParameterDecorator =>
  Body(fieldName, CloudinaryPipe);
