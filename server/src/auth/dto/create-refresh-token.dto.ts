import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RefreshToken } from '../model/refreshToken.modal';
import { Role } from 'src/typings';

export class CreateRefreshTokenDto
  implements Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'> {
  @IsString()
  username!: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  refreshToken!: string;
}
