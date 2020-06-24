import { Controller, Get } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenModel } from './schemas/refreshToken.schema';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Get('/')
  getAllRefreshToken(): Promise<RefreshTokenModel[]> {
    return this.refreshTokenService.findAll();
  }
}
