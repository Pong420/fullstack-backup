import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
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
          const schema = ProductSchema;
          schema.plugin(paginate);
          async function removeImageFromCloudinary() {
            const model: Model<Product & Document> = (this as any).model;
            const pre = await model.findOne(this.getQuery());
            if (pre.images) {
              await cloudinaryService.remove(pre.images).toPromise();
            }
          }
          schema.plugin(paginate);
          schema.pre('deleteOne', removeImageFromCloudinary);
          schema.pre('findOneAndUpdate', removeImageFromCloudinary);
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
