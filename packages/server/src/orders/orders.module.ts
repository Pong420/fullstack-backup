import { Module } from '@nestjs/common';
import { ProductsModule } from '../products';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [ProductsModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
