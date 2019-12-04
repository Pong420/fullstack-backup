import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RefreshToken } from '../model/refreshToken.modal';
import { UserRole } from '../../user';

export class CreateRefreshTokenDto
  implements Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'> {
  @IsString()
  username!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  refreshToken!: string;
}
