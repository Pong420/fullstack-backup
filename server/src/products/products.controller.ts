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
import { RoleGuard } from '../guards';
import { UserRole } from '../user';
import { MultiPartInterceptor } from '../interceptors';
import { PaginationDto, SearchDto } from '../dto';
import { CreateProductDto, UpdateProductDto, GetProductsDto } from './dto';
import { formatSearchQuery } from '../utils';
import { ProductsService } from './products.service';

@UseGuards(RoleGuard(UserRole.GUEST))
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  async getProducts(@Query()
  {
    pageNo,
    pageSize,
    tag,
    type,
    search
  }: PaginationDto & SearchDto & GetProductsDto = {}) {
    return this.productsService.paginate(
      {
        ...(tag
          ? { tags: { $in: [tag] } }
          : type
          ? { type }
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

  @Post('/')
  @UseInterceptors(MultiPartInterceptor())
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch('/:id')
  @UseInterceptors(MultiPartInterceptor())
  async updateUser(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update({ ...updateProductDto, id });
  }

  @Get('/types')
  async getTypes() {
    return this.productsService.types();
  }

  @Get('/tags')
  async getTags() {
    return this.productsService.tags();
  }
}
