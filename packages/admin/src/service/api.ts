import axios from 'axios';
import { paths } from '@fullstack/common/constants';
import { getJwtToken } from './auth';
import { handleCloudinaryUpload } from './cloudinary';

declare module 'axios' {
  interface AxiosRequestConfig {
    image?: string;
  }
}

const authUrls = [
  paths.login,
  paths.registration,
  paths.refresh_token,
  paths.admin_registration,
  paths.guest_registration
];
const authUrlRegex = new RegExp(
  `(${authUrls.join('|').replace(/\//g, '\\/')})`
);

const isAuthUrl = (url?: string) => url && authUrlRegex.test(url);

export const api = axios.create({
  baseURL: paths.base_url
});

api.interceptors.request.use(async config => {
  if (!isAuthUrl(config.url)) {
    let { token } = await getJwtToken().toPromise();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});

api.interceptors.request.use(async config => {
  const { image } = config;
  if (image && config.data[image]) {
    try {
      config.data[image] = await handleCloudinaryUpload(
        config.data[image]
      ).toPromise();
    } catch (error) {
      throw new Error('Image upload failure');
    }
  }
  return config;
});
