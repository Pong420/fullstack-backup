import { IsString, IsEmpty } from 'class-validator';

import { UserRole, Schema$RefreshToken } from '@fullstack/typings';

class Base {
  @IsEmpty()
  id?: string;

  @IsString()
  refreshToken: string;

  @IsEmpty()
  user_id?: string;

  @IsEmpty()
  username?: string;

  @IsEmpty()
  nickname?: string;

  @IsEmpty()
  role?: UserRole;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class UpdateRefreshTokenDto extends Base
  implements Required<Omit<Schema$RefreshToken, keyof Base>> {}
