import { Controller, Get } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './schemas/refreshToken.schema';
import { Access } from '../utils/access.guard';

@Access('EVERYONE')
@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Get('/')
  async getAllRefreshToken(): Promise<RefreshToken[]> {
    if (process.env.NODE_ENV === 'development') {
      return this.refreshTokenService.findAll();
    }
    return [];
  }
}
