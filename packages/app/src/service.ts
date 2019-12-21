import Constants from 'expo-constants';
import { api } from '@fullstack/common/service';

export * from '@fullstack/common/service';

const { manifest } = Constants;

const PORT = 5000;

const API_DOMAIN = __DEV__
  ? `http://${
      manifest && manifest.debuggerHost
        ? manifest.debuggerHost.split(':').shift()
        : 'localhost'
    }:${PORT}`
  : '';

api.interceptors.request.use(config => {
  config.baseURL = API_DOMAIN + config.baseURL;
  return config;
});
