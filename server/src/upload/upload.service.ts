/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Cloudinary$Image, UploadFile } from './upload.interfaces';
import cloudinary, {
  TransformationOptions,
  ConfigAndUrlOptions
} from 'cloudinary';

type RemoveImagePayload = string | { public_id: string };

export interface ResponsiveImage {
  small: string;
  medium: string;
  large: string;
  origin: string;
}

export type ResponsiveImageDimen = Record<
  Exclude<keyof ResponsiveImage, 'origin'>,
  number
>;

const defaultImageDimension: ResponsiveImageDimen = {
  small: 400,
  medium: 768,
  large: 1000
};

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

  getResponsiveImage(
    public_id: string,
    {
      dimen,
      ...options
    }: Omit<TransformationOptions | ConfigAndUrlOptions, 'width' | 'height'> & {
      dimen?: Partial<ResponsiveImageDimen>;
    } = {}
  ): ResponsiveImage {
    const _dimen = { ...defaultImageDimension, ...dimen };
    const _options = { crop: 'limit', ...options };
    const entries = Object.entries(_dimen) as [keyof ResponsiveImage, number][];
    return {
      origin: this.getImageUrl(public_id, _options),
      ...entries.reduce(
        (acc, [key, width]) => {
          acc[key] = this.getImageUrl(public_id, { ..._options, width });
          return acc;
        },
        {} as ResponsiveImage
      )
    };
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
              ? (payload.match(/[^/\\&\?]+(?=(.\w{3,4}$))/g) || [])[0]
              : undefined
            : payload.public_id;

        return public_id
          ? cloudinary.v2.uploader.destroy(public_id)
          : Promise.resolve();
      })
    );
  }
}
