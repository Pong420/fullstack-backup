export * from './user';

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export type MongoSchema<T> = Omit<T, 'id' | keyof Timestamp>;
