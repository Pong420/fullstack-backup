import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import path from 'path';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'admin')
    }),
    ProductsModule,
    OrdersModule
  ]
})
export class AppModule {}