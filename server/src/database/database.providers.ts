import { setGlobalOptions } from '@typegoose/typegoose';
import { ConfigService } from '../config';
import mongoose from 'mongoose';

setGlobalOptions({
  options: {},
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: <T extends { _id: string }>(_: unknown, ret: T) => {
        delete ret._id;
      }
    }
  },
  globalOptions: {
    useNewEnum: true
  }
});

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const mongoConnection = async (
  url: string,
  options: mongoose.ConnectionOptions = {}
) => await mongoose.connect(url, options);

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (configService: ConfigService) =>
      mongoConnection(configService.get('MONGODB_URI'), {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      }),
    inject: [ConfigService]
  }
];
