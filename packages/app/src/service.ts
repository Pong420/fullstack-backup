import Constants from 'expo-constants';
import { api } from '@fullstack/common/service';

const { manifest } = Constants;

const PORT = 5000;

const apiDomain = __DEV__
  ? `http://${
      manifest?.debuggerHost?.split(':').shift() || 'localhost'
    }:${PORT}`
  : 'https://pong-fullstack.herokuapp.com';

api.interceptors.request.use(config => ({
  ...config,
  baseURL: apiDomain.replace(/\/$/, '') + config.baseURL
}));

export * from '@fullstack/common/service';
