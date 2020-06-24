import { IsString, IsOptional, IsNumber, IsEmpty } from 'class-validator';
import { RefreshToken } from '../schemas/refreshToken.schema';

export class UpdateRefreshToken implements Partial<RefreshToken> {
  @IsString()
  user_id: string;

  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsNumber()
  expires?: Date | string;
}

export class UpdateRefreshTokenDto extends UpdateRefreshToken
  implements Required<Omit<RefreshToken, keyof UpdateRefreshToken>> {
  @IsEmpty()
  username: any;

  @IsEmpty()
  role: any;
}
