import {
  Controller,
  Post,
  Body,
  Patch,
  BadRequestException,
  Req
} from '@nestjs/common';
import { OrderStatus, UserRole } from '@fullstack/typings';
import { FastifyRequest } from 'fastify';
import { Order } from './schema/order.schema';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AttachUserPipe } from './pipe/attach-user.pipe';
import { ProductsPipe } from './pipe/products.pipe';
import { ProductsService } from '../products/products.service';
import { ObjectId } from '../utils/mongoose-crud.controller';
import { Access } from '../utils/access.guard';

@Controller('orders')
@Access('ADMIN', 'MANAGER')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productsService: ProductsService
  ) {}

  @Post()
  @Access('ADMIN', 'MANAGER', 'CLIENT')
  async create(
    @Body(AttachUserPipe, ProductsPipe) createOrderDto: CreateOrderDto
  ): Promise<Order> {
    const order = await this.orderService.create(createOrderDto);
    await Promise.all(
      order.products.map(({ id, amount }) =>
        this.productsService.frezze(id, amount)
      )
    );
    return order;
  }

  @Patch(':id')
  @Access('ADMIN', 'MANAGER', 'SELF')
  async update(
    @ObjectId() id: string,
    @Body() { status }: UpdateOrderDto,
    @Req() req: FastifyRequest
  ): Promise<Order> {
    const role = req.user.role;

    if (status === OrderStatus.CACNELED) {
      const order = await this.orderService.findOne({ id });
      if (order.status !== OrderStatus.PENDING && role === UserRole.CLIENT) {
        throw new BadRequestException('Order cannot be cacnel');
      }
    }

    const order = await this.orderService.update({ _id: id }, { status });

    if (order.status === OrderStatus.CACNELED) {
      await Promise.all(
        order.products.map(({ id, amount }) =>
          this.productsService.frezze(id, amount * -1)
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
