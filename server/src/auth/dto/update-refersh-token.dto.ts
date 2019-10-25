import { IsString } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsString()
  refreshToken?: string;
}
