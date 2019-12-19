import { api } from '@fullstack/service';

export * from '@fullstack/service';

const API_DOMAIN = __DEV__ ? 'http://localhost:5000' : '';

api.interceptors.request.use(config => {
  config.baseURL = API_DOMAIN + config.baseURL;
  return config;
});
