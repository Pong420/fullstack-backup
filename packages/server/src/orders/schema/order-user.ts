import { Schema$OrderUser, Schema$User } from '@fullstack/typings';
import { Exclude } from 'class-transformer';

class ShouldBeExcluded implements Omit<Schema$User, keyof Schema$OrderUser> {
  @Exclude()
  avatar: undefined;

  @Exclude()
  password: undefined;

  @Exclude()
  role: undefined;

  @Exclude()
  createdAt: undefined;

  @Exclude()
  updatedAt: undefined;
}

export class OrderUser extends ShouldBeExcluded implements Schema$OrderUser {
  id: string;
  nickname: string;
  username: string;
  email: string;
}
