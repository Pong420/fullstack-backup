import { Controller, Get } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenModel } from './schemas/refreshToken.schema';
import { Access } from '../utils/role.guard';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Get('/')
  @Access('ADMIN', 'MANAGER')
  getAllRefreshToken(): Promise<RefreshTokenModel[]> {
    return this.refreshTokenService.findAll();
  }
}
