import { Response$API } from '.';

export type Response$User = Response$API<Schema$User[]>;

export interface Schema$User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
