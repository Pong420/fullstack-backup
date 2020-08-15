import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schema$Tags, Schema$Category } from '@fullstack/typings';
import { Document, PaginateModel, Aggregate } from 'mongoose';
import { Product } from './schemas/products.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';
import fs from 'fs';
import path from 'path';

@Injectable()
export class ProductsService extends MongooseCRUDService<Product> {
  constructor(
    @InjectModel(Product.name)
    private productModel: PaginateModel<Product & Document>,
    private cloudinaryService: CloudinaryService
  ) {
    super(productModel, {
      searchKeys: ['name', 'category', 'tags', 'description']
    });
  }

  async stub(): Promise<void> {
    await this.clear();
    const stub = path.resolve(__dirname, '../../../../../stub');
    const items = JSON.parse(
      fs.readFileSync(path.resolve(stub, 'products.json'), 'utf-8')
    );
    const length = items.length;
    for (let i = 0; i < length; i++) {
      const data = items.shift();
      data.images = await Promise.all(
        data.images.map(image =>
          this.cloudinaryService
            .upload(path.resolve(stub, 'images', image))
            .toPromise()
            .then(res => res.secure_url)
        )
      );
      await this.create(data);

      // eslint-disable-next-line
      console.log(data.name);

      fs.writeFileSync(
        path.resolve(stub, 'products.json'),
        JSON.stringify(items, null, 2)
      );
    }
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

  async freeze(id: string, amount: number): Promise<Product> {
    return this.update({ _id: id }, { $inc: { freeze: amount } });
  }

  async sold(id: string, amount: number): Promise<Product> {
    if (amount >= 0) {
      throw new InternalServerErrorException('Amount should not be positive');
    }
    return this.update({ _id: id }, { $inc: { freeze: amount, amount } });
  }
}
