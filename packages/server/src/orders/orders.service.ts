import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Document } from 'mongoose';
import { Order } from './schema/order.schema';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';

@Injectable()
export class OrdersService extends MongooseCRUDService<Order> {
  constructor(
    @InjectModel(Order.name) orderModel: PaginateModel<Order & Document>
  ) {
    super(orderModel);
  }
}
