import { Injectable } from '@nestjs/common';
import { PaginateOptions } from 'mongoose';
import { CreateOrderDto } from './dto';
import { OrderModel } from './model';

@Injectable()
export class OrdersService {
  async create(createOrderDto: CreateOrderDto) {
    const createdProduct = new OrderModel(createOrderDto);

    try {
      return await createdProduct.save();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  paginate(
    condition?: object,
    { page = 1, limit = 10, ...options }: PaginateOptions = {}
  ) {
    return OrderModel.paginate(condition, {
      page,
      limit,
      ...options
    });
  }

  delete(id: string) {
    return OrderModel.deleteOne({ _id: id });
  }
}
