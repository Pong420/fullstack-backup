import axios from 'axios';
import { paths } from '../constants';

declare module 'axios' {
  interface AxiosRequestConfig {
    image?: string;
  }
}

export const api = axios.create({
  baseURL: paths.base_url
});
