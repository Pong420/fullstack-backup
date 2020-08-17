import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { Favourite, FavouriteSchema } from './schema/favourite.schema';
import autopopulate from 'mongoose-autopopulate';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Favourite.name,
        useFactory: async () => {
          const schema = FavouriteSchema as Schema<Favourite>;
          schema.plugin(autopopulate);
          schema.plugin(paginate);
          return schema;
        }
      }
    ])
  ],
  providers: [FavouriteService],
  controllers: [FavouriteController]
})
export class FavouriteModule {}
