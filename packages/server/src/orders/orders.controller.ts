import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Schema$Order } from '@fullstack/common/service/typings';
import { CreateOrderDto } from './dto';
import { RoleGuard } from '../guards';
import { ProductModel } from '../products/model';
import { UserRole, UserModel } from '../user';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(RoleGuard(UserRole.GUEST))
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('/')
  getOrders() {
    const selectProduct: Array<keyof Schema$Order['product']> = [
      'name',
      'images',
      'description',
      'price'
    ];
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
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: FastifyRequest
  ) {
    return this.orderService.create({
      user: req.user.id,
      ...createOrderDto
    });
  }

  @Delete('/:id')
  async delteOrder(@Param('id') id: string) {
    await this.orderService.delete(id);
  }
}
