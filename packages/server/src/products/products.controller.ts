import { Controller } from '@nestjs/common';
import { Product } from './schemas/products.schema.dto';
import { MongooseCRUDController } from '../utils/mongoose-crud.controller';

@Controller('products')
export class ProductsController extends MongooseCRUDController<Product> {}
