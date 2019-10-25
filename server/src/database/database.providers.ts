import mongoose from 'mongoose';
import { ConfigService } from '../config';
import { DATABASE_CONNECTION } from '../constants';

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

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (configService: ConfigService) =>
      await mongoose.connect(configService.get('MONGODB_URI')),
    inject: [ConfigService]
  }
];