import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ModuleMetadata, DynamicModule } from '@nestjs/common/interfaces';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MongooseSerializerInterceptor } from './utils/mongoose-serializer.interceptor';
import { AcessGuard } from './utils/access.guard';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';
import path from 'path';

mongoose.set('toJSON', {
  virtuals: true, // clone '_id' to 'id'
  versionKey: false // remove '__v',
});

const configure = (factory: ConfigFactory[] = []) =>
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
      '.env',
      '.env.local',
      `.env.${process.env.NODE_ENV}`,
      `.env.${process.env.NODE_ENV}.local`
    ],
    load: [
      () => ({
        MONGODB_URI: 'mongodb://localhost:27017/fullstack',
        JWT_TOKEN_EXPIRES_IN_MINUTES: 15,
        REFRESH_TOKEN_EXPIRES_IN_MINUTES: 7 * 24 * 60
      }),
      ...factory
    ],
    validationSchema: Joi.object({
      PORT: Joi.number().default(5000),
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
      MONGODB_URI: Joi.string(),
      CLOUDINARY_URL: Joi.string().default(''),
      JWT_SECRET: Joi.string().default('JWT_SECRET'),
      JWT_TOKEN_EXPIRES_IN_MINUTES: Joi.number().min(1),
      REFRESH_TOKEN_EXPIRES_IN_MINUTES: Joi.number().min(1),
      DEFAULT_USERNAME: Joi.string().default('admin'),
      DEFAULT_PASSWORD: Joi.string().default('admin')
    })
  });

const meta: ModuleMetadata = {
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'admin')
    }),
    UserModule,
    AuthModule,
    RefreshTokenModule,
    CloudinaryModule,
    ProductsModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MongooseSerializerInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: AcessGuard
    }
  ]
};

@Module({})
export class AppModule {
  static init(factory?: ConfigFactory[]): DynamicModule {
    return {
      ...meta,
      imports: [configure(factory), ...meta.imports],
      module: AppModule
    };
  }
}
