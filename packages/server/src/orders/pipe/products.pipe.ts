import {
  Inject,
  PipeTransform,
  BadRequestException,
  HttpException
} from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../schema/order.schema';

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
      try {
        const result = await this.productsService.findAll({
          _id: { $in: query }
        });

        if (result.length) {
          return {
            ...rest,
            products: result.map(payload => ({
              ...payload.toJSON(),
              amount: map[payload.id]
            }))
          };
        }
      } catch (error) {
        throw new HttpException(
          `Get product failure, ${error.message}`,
          error.code
        );
      }
    }
    throw new BadRequestException('No product provided');
  }
}
