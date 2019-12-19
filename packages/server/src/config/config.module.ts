import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        `.env`,
        `.env.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
        `.env.${process.env.NODE_ENV || 'development'}.local`
      )
    }
  ],
  exports: [ConfigService]
})
export class ConfigModule {}
