import { api } from './api';
import { AxiosResponse } from 'axios';
import { from } from 'rxjs';
import { retry } from 'rxjs/operators';
import { refreshToken } from './auth';
import { Schema$JWT, Response$API } from './typings';
import { PATHS } from './utils/paths';

let jwtToken: Schema$JWT | null = null;

// eslint-disable-next-line
function isJWT(data: any): data is Schema$JWT {
  return !!(data && data.expiry && data.token);
}

const authPaths = [
  PATHS.LOGIN,
  PATHS.REGISTRATION,
  PATHS.ADMIN_REGISTRATION,
  PATHS.GUEST_REGISTRATION,
  PATHS.REFERTSH_TOKEN
];

const authRegex = new RegExp(`(${authPaths.join('|').replace(/\//g, '\\/')})`);

const isAuthUrl = (url?: string) => url && authRegex.test(url);

api.interceptors.request.use(async config => {
  if (!jwtToken || +new Date(jwtToken.expiry) - +new Date() <= 60 * 1000) {
    if (!isAuthUrl(config.url)) {
      const response = await from(refreshToken())
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

// eslint-disable-next-line
api.interceptors.response.use((response: AxiosResponse<Response$API<any>>) => {
  const data = response.data.data;
  if (isAuthUrl(response.config.url) && isJWT(data)) {
    jwtToken = { token: data.token, expiry: data.expiry };
  }

  return response;
});
