import { Module } from '@nestjs/common';
import { UploadModule } from '../upload';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [UploadModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
