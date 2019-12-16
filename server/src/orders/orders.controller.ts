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
import { CreateOrderDto } from './dto';
import { RoleGuard } from '../guards';
import { Product, ProductModel } from '../products/model';
import { OrdersService } from './orders.service';
import { UserRole, UserModel, User } from '../user';
import { FastifyRequest } from 'fastify';

@Controller('orders')
@UseGuards(RoleGuard(UserRole.GUEST))
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('/')
  getOrders() {
    const selectProduct: Array<keyof Product> = [
      'name',
      'images',
      'description',
      'price'
    ];
    const selectUser: Array<keyof User> = [
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
