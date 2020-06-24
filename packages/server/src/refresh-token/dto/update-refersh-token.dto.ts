import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { RefreshToken } from '../schemas/refreshToken.schema';
import { UserRole } from '@fullstack/typings';

export class UpdateRefreshToken implements Partial<RefreshToken> {
  @IsOptional()
  @IsNumber()
  user_id?: string;

  @IsOptional()
  @IsNumber()
  username?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsNumber()
  refreshToken?: string;

  @IsOptional()
  @IsNumber()
  expires?: Date | string;
}

export class UpdateRefreshTokenDto extends UpdateRefreshToken
  implements Required<Omit<RefreshToken, keyof UpdateRefreshToken>> {}
