import axios from 'axios';
import PATHS from './paths.json';

declare module 'axios' {
  interface AxiosRequestConfig {
    errorHandle?: boolean;
  }
}

export const api = axios.create({
  baseURL: PATHS.BASE_URL
});
