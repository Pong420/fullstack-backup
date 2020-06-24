import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';
import {
  RefreshTokenModel,
  RefreshTokenSchema
} from './schemas/refreshToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RefreshTokenModel.name,
        schema: RefreshTokenSchema
      }
    ])
  ],
  controllers: [RefreshTokenController],
  exports: [RefreshTokenService],
  providers: [RefreshTokenService]
})
export class RefreshTokenModule {}
