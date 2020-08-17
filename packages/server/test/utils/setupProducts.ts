import { Product } from '../../src/products/schemas/products.schema';
import { createProduct, CreateProductDto } from '../service/products';

declare global {
  let products: Product[];
}

export async function setupProducts(
  options: Partial<CreateProductDto | Record<string, any>>[]
): Promise<void> {
  products = await Promise.all(
    options.map(dto =>
      createProduct(adminToken, dto).then(res => res.body.data)
    )
  );
}
