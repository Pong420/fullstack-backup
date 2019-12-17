import { IsString, IsEnum } from 'class-validator';
import { RefreshToken } from '../model/refreshToken.model';
import { UserRole } from '../../user';

export class CreateRefreshTokenDto
  implements Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'> {
  @IsString()
  username!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  refreshToken!: string;
}
