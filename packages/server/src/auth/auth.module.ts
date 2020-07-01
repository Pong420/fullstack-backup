import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy, JwtStrategy } from './strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RefreshTokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn:
              configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES') + 'm'
          }
        };
      },
      inject: [ConfigService]
    })
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
