import { Injectable } from '@nestjs/common';
import { Product } from './schemas/products.schema.dto';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';

@Injectable()
export class ProductsService extends MongooseCRUDService<Product> {}
