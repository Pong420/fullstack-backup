import { Controller, Get } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './schemas/refreshToken.schema';
import { Access } from '../utils/access.guard';

// TODO: access
@Access('EVERYONE')
@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Get('/')
  getAllRefreshToken(): Promise<RefreshToken[]> {
    return this.refreshTokenService.findAll();
  }
}
