import axios, { AxiosResponse, AxiosError } from 'axios';
import { from } from 'rxjs';
import { retry } from 'rxjs/operators';
import { refreshToken, REFERTSH_TOKEN_PATH } from './auth';
import { Schema$JWT, Response$API } from '../typings';
import { Toaster } from '../utils/toaster';

declare module 'axios' {
  interface AxiosRequestConfig {
    errorHandle?: boolean;
  }
}

let jwtToken: Schema$JWT | null = null;

export const api = axios.create({
  baseURL: '/api'
});

function isJWT(data: any): data is Schema$JWT {
  return !!(data && data.expiry && data.token);
}

// // delay api response, for testing only
// if (process.env.NODE_ENV === 'development') {
//   const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));
//   api.interceptors.request.use(async config => {
//     if (
//       config.url &&
//       config.url !== REFERTSH_TOKEN_PATH &&
//       config.url !== '/user'
//     ) {
//       await delay(2000);
//     }
//     return Promise.resolve(config);
//   });
// }

api.interceptors.request.use(async config => {
  if (jwtToken) {
    if ((+new Date(jwtToken.expiry) - +new Date()) / (60 * 1000) <= 1) {
      if (config.url && !new RegExp(REFERTSH_TOKEN_PATH).test(config.url)) {
        const response = await from(refreshToken())
          .pipe(retry(2))
          .toPromise();

        jwtToken = response.data.data;
      }
    }

    config.headers['Authorization'] = 'bearer ' + jwtToken.token;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<Response$API<any>>) => {
    const data = response.data.data;

    if (isJWT(data)) {
      jwtToken = { token: data.token, expiry: data.expiry };
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.config.errorHandle !== false) {
      Toaster.apiError(error);
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(async config => {
  config.baseURL = config.baseURL + '';
  return config;
});
