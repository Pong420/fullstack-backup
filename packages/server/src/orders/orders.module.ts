import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderSchema, Order } from './schema/order.schema';
import { AttachUserPipe } from './pipe/attach-user.pipe';
import { ProductsPipe } from './pipe/products.pipe';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: async () => {
          const schema = OrderSchema as Schema<Order>;
          schema.plugin(require('mongoose-autopopulate'));
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        }
      }
    ]),
    ProductsModule
  ],
  providers: [OrdersService, AttachUserPipe, ProductsPipe],
  controllers: [OrdersController]
})
export class OrdersModule {}
