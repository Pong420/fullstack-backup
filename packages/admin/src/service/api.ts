import axios from 'axios';
import { getJwtToken } from './auth';

const authUrls = ['/auth/login', '/auth/register', '/auth/refresh-token'];
const authUrlRegex = new RegExp(
  `(${authUrls.join('|').replace(/\//g, '\\/')})`
);

const isAuthUrl = (url?: string) => url && authUrlRegex.test(url);

export const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use(async config => {
  if (!isAuthUrl(config.url)) {
    let { token } = await getJwtToken().toPromise();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});
