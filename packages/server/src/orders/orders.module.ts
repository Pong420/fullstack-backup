import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderSchema, Order } from './schema/order.schema';
import { ProductsPipe } from './pipe/products.pipe';
import { ProductsModule } from '../products/products.module';
import { AttachUserPipe } from '../utils/attach-user.pipe';
import autopopulate from 'mongoose-autopopulate';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: async () => {
          const schema = OrderSchema as Schema<Order>;
          schema.plugin(autopopulate);
          schema.plugin(paginate);
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
