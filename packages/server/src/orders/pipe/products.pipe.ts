import {
  Inject,
  PipeTransform,
  BadRequestException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../schema/order.schema';
import { ProductsService } from '../../products/products.service';
import { handleMongoError } from '../../utils/mongoose-exception-filter';

export class ProductsPipe implements PipeTransform {
  constructor(
    @Inject(ProductsService) private readonly productsService: ProductsService
  ) {}

  async transform({
    products = [],
    ...rest
  }: Partial<CreateOrderDto> = {}): Promise<Partial<Order>> {
    if (products.length) {
      const { query, map } = products.reduce(
        ({ query, map }, { id, amount }) => ({
          query: [...query, id],
          map: { ...map, [id]: amount }
        }),
        {
          query: [] as string[],
          map: {} as Record<string, number>
        }
      );

      const result = await this.productsService
        .findAll({ _id: { $in: query } })
        .catch(error => {
          const [status, message] = handleMongoError(error);
          throw new HttpException(message, HttpStatus[status]);
        });

      if (result.length) {
        return {
          ...rest,
          products: result.map(model => {
            const product = model.toJSON();
            const amount = map[product.id];
            if (product.remain >= amount) {
              return { ...product, amount };
            }
            throw new BadRequestException(`${product.name} out of stock `);
          })
        };
      }
    }
    throw new BadRequestException('No product provided');
  }
}
