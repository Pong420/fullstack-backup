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
import { PaginationDto } from '../dto';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@UseGuards(RoleGuard(UserRole.GUEST))
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  async getProducts(@Query() { pageNo, pageSize }: PaginationDto = {}) {
    return this.productsService.paginate(
      {},
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
}
