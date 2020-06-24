import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
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
      ]
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
