import { paths } from '@fullstack/common/constants';
import {
  Schema$CloudinarySign,
  Param$CloudinaryUpload,
  Response$CloudinaryUpload
} from '@fullstack/typings';
import superagent from 'superagent';
import { CloudinaryService } from '../../src/cloudinary/cloudinary.service';

const cloudinaryService = app.get<CloudinaryService>(CloudinaryService);

export async function cloudinarySign(
  token: string
): Promise<Schema$CloudinarySign> {
  const response = await request
    .post(`${paths.base_url}${paths.cloudinary_sign}`)
    .set('Authorization', `bearer ${token}`)
    .send();

  if (response.error) {
    throw response.error.text;
  }

  return response.body.data;
}

export async function cloudinaryUpload({
  file,
  ...payload
}: Param$CloudinaryUpload): Promise<Response$CloudinaryUpload> {
  const [api_key, , cloud_name] = cloudinaryService.parseCloudinaryURL();

  if (!cloud_name) {
    throw new Error('Cloudinary cloud name is not defined');
  }

  if (!api_key) {
    throw new Error('Cloudinary api key is not defined');
  }

  try {
    const response = await superagent
      .post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`)
      .set('Content-Type', 'multipart/form-data')
      .field({ ...payload, api_key })
      .attach('file', file);

    return response.body;
  } catch (error) {
    throw error.response.error;
  }
}
