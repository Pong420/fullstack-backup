import {
  Controller,
  Post,
  Body,
  Patch,
  BadRequestException
} from '@nestjs/common';
import { OrderStatus, UserRole, JWTSignPayload } from '@fullstack/typings';
import { paths } from '@fullstack/common/constants';
import { Order } from './schema/order.schema';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsPipe } from './pipe/products.pipe';
import { ProductsService } from '../products/products.service';
import { ObjectId, User, UserId } from '../decorators';
import { Access } from '../utils/access.guard';

@Controller(paths.order.prefix)
@Access('ADMIN', 'MANAGER', 'CLIENT')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productsService: ProductsService
  ) {}

  @Post(paths.order.create_order)
  async create(
    @Body(ProductsPipe) createOrderDto: CreateOrderDto,
    @UserId() user: UserId
  ): Promise<Order> {
    return this.orderService.create({
      ...createOrderDto,
      ...user
    });
  }

  @Patch(paths.order.update_order)
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateOrderDto,
    @User() user: JWTSignPayload
  ): Promise<Order> {
    if (user.role === UserRole.CLIENT) {
      const order = await this.orderService.findOne({ id, user: user.user_id });
      if (order) {
        if (order.status !== OrderStatus.PENDING) {
          throw new BadRequestException(
            'Not allowed to update order in current status'
          );
        }
        if (
          typeof changes.status !== 'undefined' &&
          changes.status !== OrderStatus.CACNELED
        ) {
          throw new BadRequestException('Incorrect status');
        }
      } else {
        throw new BadRequestException('Order not found');
      }
    }

    const order = await this.orderService.update({ _id: id }, changes);

    if (order.status === OrderStatus.CACNELED) {
      await Promise.all(
        order.products.map(({ id, amount }) =>
          this.productsService.freeze(id, amount * -1)
        )
      );
    }

    if (order.status === OrderStatus.SHIPPING) {
      await Promise.all(
        order.products.map(({ id, amount }) =>
          this.productsService.sold(id, amount * -1)
        )
      );
    }

    return order;
  }
}
