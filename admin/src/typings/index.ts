export * from './auth';
export * from './user';
export * from './utils';

export type Response$API<T> = {
  statusCode: number;
  data: T;
};
