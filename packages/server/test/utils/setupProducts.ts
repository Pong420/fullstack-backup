import { Product } from '../../src/products/schemas/products.schema';
import { createProduct, CreateProductDto } from '../service/products';
import { Schema$Product } from '@fullstack/typings';

declare global {
  let products: Product[];
}

export async function setupProducts(
  options: Partial<CreateProductDto | Record<string, any>>[]
): Promise<Schema$Product[]> {
  products = await Promise.all(
    options.map(dto =>
      createProduct(admin.token, dto).then(res => res.body.data)
    )
  );
  return products;
}
