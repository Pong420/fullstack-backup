import { from, of } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Cloudinary$Image, UploadFile } from './upload.interfaces';
import cloudinary from 'cloudinary';

type RemoveImagePayload = string | { public_id: string };

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const [api_key, api_secret, cloud_name] = (
      this.configService.get('CLOUDINARY_URL') || ''
    )
      .replace('cloudinary://', '')
      .split(/:|@/);

    // eslint-disable-next-line @typescript-eslint/camelcase
    cloudinary.v2.config({ api_key, api_secret, cloud_name });
  }

  uploadImage(payload: UploadFile | UploadFile[]) {
    return Promise.all(
      (Array.isArray(payload) ? payload : [payload]).map(
        image =>
          new Promise<Cloudinary$Image>((resolve, reject) => {
            cloudinary.v2.uploader.upload(
              image.path,
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
        const publicId =
          typeof payload === 'string'
            ? /res.cloudinary.com/.test(payload)
              ? (payload.match(/[^/\\&\?]+(?=(.\w{3,4}$))/g) || [])[0]
              : undefined
            : payload.public_id;

        return publicId
          ? cloudinary.v2.uploader.destroy(publicId)
          : Promise.resolve();
      })
    );
  }
}
