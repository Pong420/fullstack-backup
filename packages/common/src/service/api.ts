import axios from 'axios';
import { paths } from '../constants';
import { getJwtToken } from './auth';

declare module 'axios' {
  interface AxiosRequestConfig {
    image?: string;
  }
}

const authUrls = [
  paths.login,
  paths.registration,
  paths.refresh_token,
  paths.guest_registration
];
const authUrlRegex = new RegExp(
  `(${authUrls.join('|').replace(/\//g, '\\/')})$`
);

const isAuthUrl = (url?: string) => url && authUrlRegex.test(url);

export const api = axios.create({
  baseURL: paths.base_url
});

api.interceptors.request.use(async config => {
  if (!isAuthUrl(config.url)) {
    const { token } = await getJwtToken().toPromise();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});
