import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule],
  exports: [UploadService],
  providers: [UploadService]
})
export class UploadModule {}
