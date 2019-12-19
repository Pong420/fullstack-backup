import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { databaseProviders } from './database.providers';

@Module({
  imports: [ConfigModule],
  exports: [...databaseProviders],
  providers: [...databaseProviders]
})
export class DatabaseModule {}
