import axios, { AxiosResponse } from 'axios';
import { defer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { JWTSignResult, ApiResponse } from '@fullstack/typings';
import { refreshToken } from './auth';

let jwtToken: JWTSignResult | null = null;

function isJWT(data: any): data is JWTSignResult {
  return !!(data && data.expiry && data.token);
}

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
  if (!jwtToken || +new Date(jwtToken.expiry) - +new Date() <= 60 * 1000) {
    if (!isAuthUrl(config.url)) {
      const response = await defer(() => refreshToken())
        .pipe(retry(2))
        .toPromise();
      jwtToken = response.data.data;
    }
  }

  if (jwtToken) {
    config.headers['Authorization'] = 'bearer ' + jwtToken.token;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const data = response.data.data;
    if (isAuthUrl(response.config.url) && isJWT(data)) {
      jwtToken = { token: data.token, expiry: data.expiry };
    }
    return response;
  }
);
