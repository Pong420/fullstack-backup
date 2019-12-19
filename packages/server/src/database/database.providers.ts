import { setGlobalOptions } from '@typegoose/typegoose';
import { ConfigService } from '../config';
import mongoose from 'mongoose';

setGlobalOptions({
  globalOptions: {
    useNewEnum: true
  }
});

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: <T extends { _id: string }>(_: unknown, ret: T) => {
    delete ret._id;
  }
});

export const mongoConnection = async (
  url: string,
  options: mongoose.ConnectionOptions = {}
) =>
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    ...options
  });

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (configService: ConfigService) =>
      mongoConnection(configService.get('MONGODB_URI')),
    inject: [ConfigService]
  }
];
