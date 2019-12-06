export * from './auth';
export * from './user';
export * from './utils';

export interface Response$API<T> {
  statusCode: number;
  data: T;
}
