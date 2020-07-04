import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, PaginateModel, Aggregate } from 'mongoose';
import { Product } from './schemas/products.schema.dto';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';
import { Schema$Tags, Schema$Category } from '@fullstack/typings';

@Injectable()
export class ProductsService extends MongooseCRUDService<Product> {
  constructor(
    @InjectModel(Product.name)
    private productModel: PaginateModel<Product & Document>
  ) {
    super(productModel);
  }

  categories(): Aggregate<Schema$Category[]> {
    return this.productModel
      .aggregate()
      .allowDiskUse(true)
      .group({ _id: '$category', total: { $sum: 1 } })
      .project({
        _id: 0,
        category: '$_id',
        total: 1
      });
  }

  tags(): Aggregate<Schema$Tags[]> {
    return this.productModel
      .aggregate()
      .allowDiskUse(true)
      .unwind('$tags')
      .group({ _id: '$tags', total: { $sum: 1 } })
      .project({
        _id: 0,
        tag: '$_id',
        total: 1
      });
  }
}
