/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Cloudinary$Image, UploadFile } from './upload.interfaces';
import cloudinary, {
  TransformationOptions,
  ConfigAndUrlOptions
} from 'cloudinary';

type RemoveImagePayload = string | { public_id: string };

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    const [api_key, api_secret, cloud_name] = (
      this.configService.get('CLOUDINARY_URL') || ''
    )
      .replace('cloudinary://', '')
      .split(/:|@/);

    cloudinary.v2.config({ api_key, api_secret, cloud_name });
  }

  getImageUrl(
    public_id: string,
    options: TransformationOptions | ConfigAndUrlOptions = {}
  ) {
    return cloudinary.v2.url(public_id, options);
  }

  uploadImage(
    payload: UploadFile | UploadFile[],
    options?: cloudinary.UploadApiOptions
  ) {
    return Promise.all(
      (Array.isArray(payload) ? payload : [payload]).map(
        image =>
          new Promise<Cloudinary$Image>((resolve, reject) => {
            cloudinary.v2.uploader.upload(
              image.path,
              options,
              (error: Error, result: Cloudinary$Image) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          })
      )
    );
  }

  removeImage(payload: RemoveImagePayload | RemoveImagePayload[]) {
    return Promise.all(
      (Array.isArray(payload) ? payload : [payload]).map(payload => {
        const public_id =
          typeof payload === 'string'
            ? /res.cloudinary.com/.test(payload)
              ? (payload.match(/[^/\\&\?]+(?=(.\.\w{3,4})$|$)/g) || [])[0]
              : undefined
            : payload.public_id;

        return public_id
          ? cloudinary.v2.uploader.destroy(public_id)
          : Promise.resolve();
      })
    );
  }
}
