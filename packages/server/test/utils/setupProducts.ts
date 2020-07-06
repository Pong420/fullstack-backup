import { SuperAgentRequest } from 'superagent';
import { Product } from '../../src/products/schemas/products.schema.dto';
import { CreateProductDto } from '../../src/products/dto/create-product.dto';
import { rid } from './rid';

declare global {
  let products: Product[];
}

export function createProductDto(
  dto: Partial<CreateProductDto> = {}
): CreateProductDto {
  return {
    name: `e2e-product-${rid()}`,
    price: 100,
    amount: 100,
    category: rid(8),
    ...dto
  };
}

export function createProduct(
  token: string,
  dto: Partial<CreateProductDto> | Record<string, any> = {}
): SuperAgentRequest {
  return request
    .post('/api/products')
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'multipart/form-data')
    .field(createProductDto(dto) as any);
}

export async function setupProducts(
  options: Partial<CreateProductDto | Record<string, any>>[] = []
): Promise<void> {
  products = await Promise.all(
    options.map(dto =>
      createProduct(adminToken, dto).then(res => res.body.data)
    )
  );
}
