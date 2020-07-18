import { Inject, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../schema/order.schema';
import { ProductsService } from '../../products/products.service';

export class ProductsPipe implements PipeTransform {
  constructor(
    @Inject(ProductsService) private readonly productsService: ProductsService
  ) {}

  async transform({
    products = [],
    ...rest
  }: Partial<CreateOrderDto> = {}): Promise<Partial<Order>> {
    if (products.length) {
      return {
        ...rest,
        products: await Promise.all(
          products.map(async ({ id, amount }) => ({
            ...(await this.productsService.freeze(id, amount)),
            amount
          }))
        )
      };
    }

    throw new BadRequestException('No product provided');
  }
}
