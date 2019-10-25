export * from './user';

export type Response$API<T> = {
  statusCode: number;
  data: T;
};
