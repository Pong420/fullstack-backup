import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserRole, Schema$RefreshToken } from '@fullstack/typings';

class Base {
  @Exclude()
  id?: string;

  @IsString()
  refreshToken: string;

  @Exclude()
  user_id?: string;

  @Exclude()
  username?: string;

  @Exclude()
  nickname?: string;

  @Exclude()
  role?: UserRole;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

export class UpdateRefreshTokenDto extends Base
  implements Required<Omit<Schema$RefreshToken, keyof Base>> {}
