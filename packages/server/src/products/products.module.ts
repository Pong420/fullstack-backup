import { Module, BadRequestException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, Document, Query } from 'mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/products.schema.dto';
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
          async function removeImageFromCloudinary(this: Query<any>) {
            const model: Model<Product & Document> = (this as any).model;
            const product = await model.findOne(this.getQuery());
            if (product?.images?.length) {
              await cloudinaryService.remove(product.images).toPromise();
            }
          }

          const schema = ProductSchema;
          schema.plugin(paginate);
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
