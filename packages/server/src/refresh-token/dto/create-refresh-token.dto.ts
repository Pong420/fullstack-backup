import { IsString, IsEnum, IsNumber } from 'class-validator';
import { UserRole } from '@fullstack/typings';
import { RefreshToken } from '../schemas/refreshToken.schema';

export class CreateRefreshTokenDto implements Omit<RefreshToken, 'id'> {
  @IsString()
  user_id: string;

  @IsString()
  username: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  refreshToken: string;

  @IsNumber()
  expires: Date | string;
}
