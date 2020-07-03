import { from, defer, of, empty, Observable } from 'rxjs';
import {
  concatMap,
  tap,
  retry,
  catchError,
  zipAll,
  mergeMap
} from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cloudinary, {
  TransformationOptions,
  ConfigAndUrlOptions,
  UploadApiOptions,
  UploadApiResponse
} from 'cloudinary';
import { Uploaded } from '../utils/multi-part.interceptor';
import fs from 'fs';

type RemovePayload = string | { public_id: string };
type UploadResponse = UploadApiResponse | null;

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    const [api_key, api_secret, cloud_name] = this.configService
      .get<string>('CLOUDINARY_URL')
      .replace('cloudinary://', '')
      .split(/:|@/);

    cloudinary.v2.config({ api_key, api_secret, cloud_name });
  }

  getImageUrl(
    public_id: string,
    options: TransformationOptions | ConfigAndUrlOptions = {}
  ): string {
    return cloudinary.v2.url(public_id, options);
  }

  upload(
    payload: Uploaded,
    options?: UploadApiOptions
  ): Observable<UploadResponse>;
  upload(
    payload: Uploaded[],
    options?: UploadApiOptions
  ): Observable<UploadResponse[]>;
  upload(
    payload: Uploaded | Uploaded[],
    options?: UploadApiOptions
  ): Observable<UploadResponse | UploadResponse[]> {
    const handler = (uploaded: Uploaded): Observable<UploadResponse> =>
      defer(() => cloudinary.v2.uploader.upload(uploaded.path, options)).pipe(
        retry(2),
        catchError(() => of(null)),
        tap(() => fs.unlinkSync(uploaded.path))
      );

    return Array.isArray(payload)
      ? from(payload).pipe(
          concatMap(uploaded =>
            of<Observable<UploadResponse>>(handler(uploaded))
          ),
          zipAll()
        )
      : handler(payload);
  }

  remove(payload: RemovePayload | RemovePayload[]): Observable<unknown> {
    const source$ = from(Array.isArray(payload) ? payload : [payload]);
    return source$.pipe(
      mergeMap(payload => {
        const public_id =
          typeof payload === 'string'
            ? /res.cloudinary.com/.test(payload)
              ? (payload.match(/[^/\\&\?]+(?=(.\w{3,4})$)/) || [])[0]
              : undefined
            : payload.public_id;

        return public_id ? cloudinary.v2.uploader.destroy(public_id) : empty();
      })
    );
  }
}
