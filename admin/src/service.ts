import { AxiosResponse, AxiosError } from 'axios';
import { api } from '@fullstack/service';
import { Toaster } from './utils/toaster';

export * from '@fullstack/service';

api.interceptors.response.use(
  (response: AxiosResponse<any>) => response,
  (error: AxiosError) => {
    if (error.config.errorHandle !== false) {
      Toaster.apiError(error);
    }
    return Promise.reject(error);
  }
);
