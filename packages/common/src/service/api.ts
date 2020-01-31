import axios from 'axios';
import PATHS from './paths.json';

export const api = axios.create({
  baseURL: PATHS.BASE_URL
});
