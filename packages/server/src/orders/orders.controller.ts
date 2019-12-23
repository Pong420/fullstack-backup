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
import { Schema$Order } from '@fullstack/common/service/typings';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { RoleGuard } from '../guards';
import { ProductModel } from '../products/model';
import { UserRole, UserModel } from '../user';
import { OrdersService } from './orders.service';
import { ProductsService } from '../products';
import { Order } from './model';

const isOrderProducts = (
  payload: Order['products']
): payload is Schema$Order['products'] => {
  return (
    Array.isArray(payload) &&
    payload.every(item => item && typeof item.product === 'string')
  );
};

@Controller('orders')
@UseGuards(RoleGuard(UserRole.GUEST))
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService
  ) {}

  @Get('/')
  getOrders() {
    const selectProduct: Array<
      keyof Schema$Order['products'][number]['product']
    > = ['name', 'images', 'description', 'price', 'remain'];

    const selectUser: Array<keyof Schema$Order['user']> = [
      'id',
      'nickname',
      'username',
      'email'
    ];

    return this.orderService.paginate(
      {},
      {
        populate: [
          {
            path: 'product',
            model: ProductModel,
            select: selectProduct.join(' ')
          },
          {
            path: 'user',
            model: UserModel,
            select: selectUser.join(' ')
          }
        ]
      }
    );
  }

  @Post('/')
  async createOrder(
    @Body()
    { products, ...createOrderDto }: CreateOrderDto,
    @Req() req: FastifyRequest
  ) {
    for (const { product: id, amount } of products) {
      const product = await this.productService.findById(id);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      if (product.remain < amount) {
        throw new BadRequestException('Cannot provide enough products');
      }
    }

    return this.orderService.create({
      products,
      user: req.user.id,
      ...createOrderDto
    });
  }

  @Patch('/:id')
  async updateOrder(
    @Param() id: string,
    @Body() { products, ...updateOrderDto }: UpdateOrderDto
  ) {
    const order = await this.orderService.findById(id);

    if (order && isOrderProducts(order.products)) {
      for (const { product: id, amount } of products) {
        const product = await this.productService.findById(id);

        if (!product) {
          throw new BadRequestException('Product not found');
        }

        if (product.remain < amount) {
          throw new BadRequestException('Cannot provide enough products');
        }
      }

      return this.orderService.update(order.id, {
        products,
        ...updateOrderDto
      });
    }

    throw new BadRequestException('Order not found');
  }

  @Delete('/:id')
  async delteOrder(@Param('id') id: string) {
    await this.orderService.delete(id);
  }
}
