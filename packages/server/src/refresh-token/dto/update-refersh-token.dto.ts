import { IsString, IsEmpty } from 'class-validator';
import { RefreshToken } from '../schemas/refreshToken.schema';
import { UserRole } from '@fullstack/typings';

export class UpdateRefreshToken implements Partial<RefreshToken> {
  @IsEmpty()
  user_id?: string;

  @IsEmpty()
  username?: string;

  @IsEmpty()
  role?: UserRole;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class UpdateRefreshTokenDto extends UpdateRefreshToken
  implements Required<Omit<RefreshToken, keyof UpdateRefreshToken>> {
  @IsString()
  refreshToken: string;
}
