import { api } from './api';
import { AxiosResponse } from 'axios';
import { from } from 'rxjs';
import { retry } from 'rxjs/operators';
import { refreshToken } from './auth';
import { Schema$JWT, Response$API } from './typings';
import PATHS from './paths.json';

let jwtToken: Schema$JWT | null = null;

// eslint-disable-next-line
function isJWT(data: any): data is Schema$JWT {
  return !!(data && data.expiry && data.token);
}

api.interceptors.request.use(async config => {
  if (jwtToken) {
    if ((+new Date(jwtToken.expiry) - +new Date()) / (60 * 1000) <= 1) {
      if (
        config.url &&
        !new RegExp(PATHS.AUTH.REFERTSH_TOKEN).test(config.url)
      ) {
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

// eslint-disable-next-line
api.interceptors.response.use((response: AxiosResponse<Response$API<any>>) => {
  const data = response.data.data;

  if (isJWT(data)) {
    jwtToken = { token: data.token, expiry: data.expiry };
  }

  return response;
});
