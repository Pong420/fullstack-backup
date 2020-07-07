import { Inject, PipeTransform, mixin, Type } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Uploaded } from '../utils/multi-part.interceptor';

export function CloudinaryPipe(fieldName?: string): Type<PipeTransform> {
  class MixinPipe implements PipeTransform {
    constructor(
      @Inject(CloudinaryService)
      private readonly cloudinaryService: CloudinaryService
    ) {}

    async transform(body: Record<string, unknown>): Promise<unknown> {
      const value = body[fieldName];
      if (typeof value !== 'undefined') {
        body[fieldName] = await (Array.isArray(value)
          ? Promise.all(value.map(this.upload.bind(this)))
          : this.upload(value));
      }
      return body;
    }

    async upload(value: unknown) {
      if (value && typeof value === 'object' && 'path' in value) {
        return this.cloudinaryService
          .upload(value as Uploaded)
          .toPromise()
          .then(response => response.secure_url);
      }
      return value;
    }
  }

  return mixin(MixinPipe);
}
