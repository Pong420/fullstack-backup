import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Patch,
  Query, // eslint-disable-line
  Param,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { SERVICE_PATHS } from '@fullstack/common/service';
import { RoleGuard } from '../guards';
import { UserRole } from '../user';
import { MultiPartInterceptor } from '../interceptors';
import { PaginationDto, SearchDto } from '../dto';
import { CreateProductDto, UpdateProductDto, GetProductsDto } from './dto';
import { formatSearchQuery } from '../utils';
import { ProductsService } from './products.service';

@UseGuards(RoleGuard(UserRole.GUEST))
@Controller(SERVICE_PATHS.PRODUCTS.PREFIX)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(SERVICE_PATHS.PRODUCTS.GET_PRODUCTS)
  async getProducts(@Query()
  {
    pageNo,
    pageSize,
    search,
    tag,
    category
  }: PaginationDto & SearchDto & GetProductsDto = {}) {
    return this.productsService.paginate(
      {
        ...(tag
          ? { tags: { $in: [tag] } }
          : category
          ? { category }
          : search
          ? formatSearchQuery(['name'], search)
          : {})
      },
      {
        sort: { createdAt: 1 },
        page: pageNo,
        limit: pageSize
      }
    );
  }

  @Post(SERVICE_PATHS.PRODUCTS.CREATE_PRODUCT)
  @UseInterceptors(MultiPartInterceptor())
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Delete(SERVICE_PATHS.PRODUCTS.DELETE_PRODUCT)
  async deleteUser(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch(SERVICE_PATHS.PRODUCTS.UPDATE_PRODUCT)
  @UseInterceptors(MultiPartInterceptor())
  async updateUser(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update({ ...updateProductDto, id });
  }

  @Get(SERVICE_PATHS.PRODUCTS.GET_SUGGESTION_CATEGORY)
  async getCategories() {
    return this.productsService.categories();
  }

  @Get(SERVICE_PATHS.PRODUCTS.GET_SUGGESTION_TAGS)
  async getTags() {
    return this.productsService.tags();
  }
}
