import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  UseInterceptors
} from '@nestjs/common';
import { Product } from './schemas/products.schema.dto';
import { ProductsService } from './products.service';
import { CloudinaryPipe } from '../cloudinary/cloudinary.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  MongooseCRUDController,
  PaginateResult,
  Condition,
  ObjectId
} from '../utils/mongoose-crud.controller';
import { Access } from '../utils/access.guard';
import { MultiPartInterceptor } from '../utils/multi-part.interceptor';

@Controller('products')
@Access('ADMIN', 'MANAGER')
export class ProductsController extends MongooseCRUDController<Product> {
  constructor(private readonly productService: ProductsService) {
    super(productService);
  }

  @Get()
  getAll(
    @Query() { tags, ...query }: QueryProductDto
  ): Promise<PaginateResult<Product>> {
    const condition: Condition[] = [];

    if (tags && !!tags.length) {
      condition.push({ tags: { $in: tags } });
    }

    return this.productService.paginate({
      ...query,
      condition
    });
  }

  @Post()
  @UseInterceptors(MultiPartInterceptor())
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  @UseInterceptors(MultiPartInterceptor())
  async update(
    @ObjectId() id: string,
    @Body(CloudinaryPipe('images')) changes: UpdateProductDto
  ): Promise<Product> {
    return this.productService.update({ _id: id }, changes);
  }
}
