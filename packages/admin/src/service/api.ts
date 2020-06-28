import axios from 'axios';
import { getJwtToken } from './auth';

const authRegex = /\/auth\.*/;
const exlcudePaths = ['register/admin'];
const excludeRegex = new RegExp(
  `(${exlcudePaths.join('|').replace(/\//g, '\\/')})`
);
const isAuthUrl = (url?: string) =>
  url && authRegex.test(url) && !excludeRegex.test(url);

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
