import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  Patch
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import {
  Schema$Order,
  Required$CreateOrder
} from '@fullstack/common/service/typings';
import { QueryPopulateOptions } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { RoleGuard } from '../guards';
import { ProductModel } from '../products/model';
import { UserRole, UserModel } from '../user';
import { OrdersService } from './orders.service';
import { ProductsService } from '../products';

@Controller('orders')
@UseGuards(RoleGuard(UserRole.GUEST))
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService
  ) {}

  getPopulateOptions({ user = false }: { user?: boolean } = {}) {
    type ProductKeys = keyof Schema$Order['products'][number]['product'];

    const selectProduct: ProductKeys[] = [
      'name',
      'images',
      'description',
      'price',
      'remain'
    ];

    const selectUser: Array<keyof NonNullable<Schema$Order['user']>> = [
      'id',
      'nickname',
      'username',
      'email'
    ];

    const options: QueryPopulateOptions[] = [
      {
        path: 'products.product',
        model: ProductModel,
        select: selectProduct.join(' ')
      }
    ];

    if (user) {
      options.push({
        path: 'user',
        model: UserModel,
        select: selectUser.join(' ')
      });
    }

    return options;
  }

  async checkProducts(products: Required$CreateOrder['products']) {
    for (const { product: id, amount } of products) {
      const product = await this.productService.findById(id);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      if (product.remain < amount) {
        throw new BadRequestException('Cannot provide enough products');
      }
    }
  }

  @Get('/')
  getOrders() {
    return this.orderService.paginate(
      {},
      {
        populate: this.getPopulateOptions()
      }
    );
  }

  @Post('/')
  async createOrder(
    @Body()
    { products, ...createOrderDto }: CreateOrderDto,
    @Req() req: FastifyRequest
  ) {
    this.checkProducts(products);

    return (await this.orderService.create({
      products,
      user: req.user.id,
      ...createOrderDto
    }))
      .populate(this.getPopulateOptions())
      .execPopulate();
  }

  @Patch('/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() { products, ...updateOrderDto }: UpdateOrderDto
  ) {
    const order = await this.orderService.findById(id);

    if (order) {
      this.checkProducts(products);

      return await this.orderService
        .update(order.id, {
          products,
          ...updateOrderDto
        })
        .populate(this.getPopulateOptions());
    }

    throw new BadRequestException('Order not found');
  }

  @Delete('/:id')
  async delteOrder(@Param('id') id: string) {
    await this.orderService.delete(id);
  }
}
