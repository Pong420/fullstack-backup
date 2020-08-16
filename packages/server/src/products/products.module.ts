import { Module, BadRequestException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema$Product } from '@fullstack/typings';
import {
  Model,
  Document,
  Query,
  MongooseFuzzySearchingField,
  Schema
} from 'mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/products.schema';
import { fuzzySearch } from '../utils/mongoose-fuzzy-search';
import paginate from 'mongoose-paginate-v2';

type Changes = Partial<Product> & { $inc?: Partial<Product> };

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [CloudinaryModule],
        inject: [CloudinaryService],
        name: Product.name,
        useFactory: async (cloudinaryService: CloudinaryService) => {
          const schema = ProductSchema as Schema<Product>;

          const fields: MongooseFuzzySearchingField<Schema$Product>[] = [
            { name: 'name' },
            { name: 'category' },
            'tags' // TODO: wait for mongoose-fuzzy-searching
          ];

          schema.plugin(fuzzySearch, { fields });

          schema.plugin(paginate);

          async function removeImageFromCloudinary(this: Query<any>) {
            const model: Model<Product & Document> = (this as any).model;
            const product = await model.findOne(this.getQuery());
            if (product?.images?.length) {
              await cloudinaryService.remove(product.images).toPromise();
            }
          }

          schema.pre('deleteOne', removeImageFromCloudinary);
          schema.pre('findOneAndUpdate', async function () {
            const update: Changes = this.getUpdate();
            if (update?.images) {
              await removeImageFromCloudinary.call(this);
            }
          });
          schema.pre('findOneAndUpdate', async function () {
            const changes: Changes = this.getUpdate();
            if (typeof changes?.freeze === 'number' || changes?.$inc?.freeze) {
              const model: Model<Product & Document> = (this as any).model;
              const product = await model.findOne(this.getQuery());
              if (
                product &&
                product.remain <
                  Math.max(
                    changes.freeze || 0,
                    changes.$inc.freeze || 0 + product.freeze
                  )
              ) {
                throw new BadRequestException(`${product.name} out of stock `);
              }
            }
          });
          return schema;
        }
      }
    ]),
    CloudinaryModule
  ],
  exports: [ProductsService],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
