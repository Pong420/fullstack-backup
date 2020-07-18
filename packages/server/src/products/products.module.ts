import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, Document, Query } from 'mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/products.schema.dto';
import paginate from 'mongoose-paginate-v2';

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
            const current = await model.findOne(this.getQuery());
            if (current.images && current.images.length) {
              await cloudinaryService.remove(current.images).toPromise();
            }
          }

          const schema = ProductSchema;
          schema.plugin(paginate);
          schema.pre('deleteOne', removeImageFromCloudinary);
          schema.pre('findOneAndUpdate', async function () {
            const update: Partial<Product> = this.getUpdate();
            if (update.images) {
              await removeImageFromCloudinary.call(this);
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
