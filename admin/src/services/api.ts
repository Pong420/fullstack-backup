import axios, { AxiosResponse } from 'axios';
import { from } from 'rxjs';
import { retry } from 'rxjs/operators';
import { refreshToken, REFERTSH_TOKEN_PATH } from './auth';
import { Schema$JWT, Response$API } from '../typings';

let jwtToken: Schema$JWT | null = null;

export const api = axios.create({
  baseURL: '/api'
});

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

api.interceptors.response.use((response: AxiosResponse<Response$API<any>>) => {
  const data = response.data.data;
  if (data && data.expiry && data.token) {
    jwtToken = { token: data.token, expiry: data.expiry };
  }
  return response;
});
