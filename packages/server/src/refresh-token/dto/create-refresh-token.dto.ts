import { IsString, IsEnum, IsEmpty } from 'class-validator';
import { UserRole } from '@fullstack/typings';
import { RefreshToken } from '../schemas/refreshToken.schema';

export class CreateRefreshTokenDto implements RefreshToken {
  @IsEmpty()
  id?: string;

  @IsString()
  user_id: string;

  @IsString()
  username: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  refreshToken: string;

  @IsEmpty()
  createdAt: string;

  @IsEmpty()
  updatedAt: string;
}
