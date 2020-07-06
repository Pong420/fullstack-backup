import { IsString, IsEnum } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  UserRole,
  Schema$RefreshToken,
  Param$CreateRefreshToken,
  DTOExcluded
} from '@fullstack/typings';

type Schema = Schema$RefreshToken & Param$CreateRefreshToken;

class Excluded
  implements DTOExcluded<Schema$RefreshToken, Param$CreateRefreshToken> {
  @Exclude()
  id?: string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

class CreateRefreshToken extends Excluded
  implements
    Partial<Omit<Schema, keyof Excluded | keyof CreateRefreshTokenDto>> {}

export class CreateRefreshTokenDto extends CreateRefreshToken
  implements Required<Omit<Schema, keyof CreateRefreshToken>> {
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
