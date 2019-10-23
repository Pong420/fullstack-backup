import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [],
  providers: []
})
export class AppModule {}
