import {
  Controller,
  Post,
  Body,
  Patch,
  Req,
  ForbiddenException
} from '@nestjs/common';
import { OrderStatus, UserRole } from '@fullstack/typings';
import { paths } from '@fullstack/common/constants';
import { FastifyRequest } from 'fastify';
import { Order } from './schema/order.schema';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsPipe } from './pipe/products.pipe';
import { ProductsService } from '../products/products.service';
import { AttachUserPipe } from '../utils/attach-user.pipe';
import { ObjectId } from '../utils/mongoose-crud.controller';
import { Access } from '../utils/access.guard';

@Controller(paths.order.prefix)
@Access('ADMIN', 'MANAGER')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productsService: ProductsService
  ) {}

  @Post(paths.order.create_order)
  @Access('ADMIN', 'MANAGER', 'CLIENT')
  async create(
    @Body(AttachUserPipe, ProductsPipe) createOrderDto: CreateOrderDto
  ): Promise<Order> {
    const order = await this.orderService.create(createOrderDto);
    return order;
  }

  @Patch(paths.order.update_order)
  @Access('ADMIN', 'MANAGER', 'CLIENT')
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateOrderDto,
    @Req() { user }: FastifyRequest
  ): Promise<Order> {
    if (user.role === UserRole.CLIENT) {
      const order = await this.orderService.findOne({ id });
      if (
        order.user.id !== user.user_id ||
        order.status !== OrderStatus.PENDING || // client update order only if the status is pending
        (typeof changes.status !== 'undefined' &&
          changes.status !== OrderStatus.CACNELED)
      ) {
        throw new ForbiddenException('Permission Denied');
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
