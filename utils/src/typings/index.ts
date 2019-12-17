export * from './user';
export * from './product';
export * from './order';

export interface Schema$Timestamp {
  createdAt: string;
  updatedAt: string;
}

export type Partially<T extends {}, K extends keyof T> = Omit<T, K> &
  Pick<Partial<T>, K>;
