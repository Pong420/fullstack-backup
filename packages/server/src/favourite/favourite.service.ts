import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, PaginateModel } from 'mongoose';
import { Favourite } from './schema/favourite.schema';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';

@Injectable()
export class FavouriteService extends MongooseCRUDService<Favourite> {
  constructor(
    @InjectModel(Favourite.name)
    favouriteModel: PaginateModel<Favourite & Document>
  ) {
    super(favouriteModel);
  }
}
