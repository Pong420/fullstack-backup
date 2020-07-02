import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, PaginateModel } from 'mongoose';
import { Product } from './schemas/products.schema.dto';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';

@Injectable()
export class ProductsService extends MongooseCRUDService<Product> {
  constructor(
    @InjectModel(Product.name) model: PaginateModel<Product & Document>
  ) {
    super(model);
  }
}
