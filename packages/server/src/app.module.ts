import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';

//  remove _v and _id
mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: <T extends { _id: string }>(_: unknown, ret: T) => {
    delete ret._id;
  }
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        '.env.local',
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`
      ],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        MONGODB_URI: Joi.string().default(
          'mongodb://localhost:27017/fullstack'
        ),
        JWT_SECRET: Joi.string().default('JWT_SECRET'),
        JWT_TOKEN_EXPIRES_IN_MINUTES: Joi.number().min(1).default(15),
        REFRESH_TOKEN_EXPIRES_IN_MINUTES: Joi.number()
          .min(1)
          .default(7 * 24 * 60),
        DEFAULT_USERNAME: Joi.string().default('admin'),
        DEFAULT_PASSWORD: Joi.string().default('admin')
      })
    }),
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
    UserModule,
    AuthModule,
    RefreshTokenModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
