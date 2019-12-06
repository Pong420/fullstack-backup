import { ConfigService } from '../config';
import mongoose from 'mongoose';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: <T extends { _id: string }>(_: unknown, ret: T) => {
    delete ret._id;
  }
});

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const mongoConnection = async (url: string) =>
  await mongoose.connect(url);

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (configService: ConfigService) =>
      mongoConnection(configService.get('MONGODB_URI')),
    inject: [ConfigService]
  }
];
