import { Controller, Post, Body } from '@nestjs/common';
import { Order } from './schema/order.schema';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AttachUserPipe } from './pipe/attach-user.pipe';
import { ProductsPipe } from './pipe/products.pipe';
import { Access } from '../utils/access.guard';
import { MongooseCRUDController } from '../utils/mongoose-crud.controller';

@Controller('orders')
@Access('ADMIN', 'MANAGER', 'CLIENT')
export class OrdersController extends MongooseCRUDController<Order> {
  constructor(private readonly orderService: OrdersService) {
    super(orderService);
  }

  @Post()
  create(
    @Body(AttachUserPipe, ProductsPipe) createOrderDto: CreateOrderDto
  ): Promise<Order> {
    return super.create(createOrderDto);
  }
}
