import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import path from 'path';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'admin')
    })
  ]
})
export class AppModule {}
