import { Controller, Post, Body, Get, Query, Patch, Req } from '@nestjs/common';
import { paths } from '@fullstack/common/constants';
import { FastifyRequest } from 'fastify';
import { Product } from './schemas/products.schema.dto';
import { ProductsService } from './products.service';
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
import { Schema$Category, Schema$Tags, UserRole } from '@fullstack/typings';

@Controller(paths.products.prefix)
@Access('ADMIN', 'MANAGER')
export class ProductsController extends MongooseCRUDController<Product> {
  constructor(private readonly productService: ProductsService) {
    super(productService);
  }

  @Get()
  @Access('ADMIN', 'MANAGER', 'CLIENT', 'GUEST')
  getAll(
    @Query() { tag, tags, hidden, ...query }: QueryProductDto,
    @Req() req: FastifyRequest
  ): Promise<PaginateResult<Product>> {
    const condition: Condition[] = [];

    if (tag) {
      condition.push({ tags: { $in: [tag] } });
    }

    if (tags && tags.length) {
      condition.push({ tags: { $in: tags } });
    }

    const extra: QueryProductDto = {
      hidden: req.user.role === UserRole.CLIENT ? false : hidden
    };

    return this.productService.paginate({
      ...query,
      // remove undefined
      ...JSON.parse(JSON.stringify(extra)),
      condition
    });
  }

  @Post(paths.products.create_product)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Patch(paths.products.update_product)
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateProductDto
  ): Promise<Product> {
    return this.productService.update({ _id: id }, changes);
  }

  @Get(paths.products.get_category)
  async getCategories(): Promise<Schema$Category[]> {
    return this.productService.categories();
  }

  @Get(paths.products.get_tags)
  async getTags(): Promise<Schema$Tags[]> {
    return this.productService.tags();
  }
}
