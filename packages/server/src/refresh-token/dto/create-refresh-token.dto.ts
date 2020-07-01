import { IsString, IsEnum } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  UserRole,
  Schema$RefreshToken,
  Param$CreateRefreshToken
} from '@fullstack/typings';

class Base implements Param$CreateRefreshToken {
  @IsString()
  user_id: string;

  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsEnum(UserRole)
  @Transform(Number)
  role: UserRole;

  @IsString()
  refreshToken: string;
}

class CreateRefreshToken extends Base
  implements
    Partial<Omit<Schema$RefreshToken | Param$CreateRefreshToken, keyof Base>> {
  @Exclude()
  id?: string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

export class CreateRefreshTokenDto extends CreateRefreshToken
  implements
    Required<
      Omit<
        Schema$RefreshToken & Param$CreateRefreshToken,
        keyof CreateRefreshToken
      >
    > {}
