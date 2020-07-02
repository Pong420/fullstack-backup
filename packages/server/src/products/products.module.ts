import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/products.schema.dto';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: async () => {
          const schema = ProductSchema;
          schema.plugin(paginate);
          return schema;
        }
      }
    ]),
    CloudinaryModule
  ],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
