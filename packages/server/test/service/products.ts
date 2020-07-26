import { SuperAgentRequest } from 'superagent';
import { paths } from '@fullstack/common/constants';
import { CreateProductDto } from '../../src/products/dto/create-product.dto';
import { UpdateProductDto } from '../../src/products/dto/update-product.dto';
import { rid } from '../utils/rid';
import qs from 'qs';

export { CreateProductDto, UpdateProductDto };

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
    .post(paths.create_product)
    .set('Authorization', `bearer ${token}`)
    .send(createProductDto(dto) as any);
}

export function getProducts(
  token: string,
  query: Record<string, any> = {}
): SuperAgentRequest {
  return request
    .get(paths.get_products)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query));
}

export function getProduct(token: string, id: string): SuperAgentRequest {
  return request
    .get(paths.get_product.generatePath({ id }))
    .set('Authorization', `bearer ${token}`);
}

export function updateProduct(
  token: string,
  id: string,
  changes: UpdateProductDto
): SuperAgentRequest {
  return request
    .patch(paths.update_product.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send((changes || {}) as any);
}

export function deleteProduct(token: string, id: string): SuperAgentRequest {
  return request
    .delete(paths.delete_product.generatePath({ id }))
    .set('Authorization', `bearer ${token}`);
}

export function getTags(token: string): SuperAgentRequest {
  return request.get(paths.get_tags).set('Authorization', `bearer ${token}`);
}

export function getCategories(token: string): SuperAgentRequest {
  return request
    .get(paths.get_category)
    .set('Authorization', `bearer ${token}`);
}
