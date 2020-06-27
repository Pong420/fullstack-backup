import { IsString, IsEnum, IsEmpty } from 'class-validator';
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

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  refreshToken: string;
}

class CreateRefreshToken extends Base
  implements
    Partial<Omit<Schema$RefreshToken | Param$CreateRefreshToken, keyof Base>> {
  @IsEmpty()
  id?: string;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
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
