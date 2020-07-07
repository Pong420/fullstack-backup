import { SuperAgentRequest } from 'superagent';
import { CreateProductDto } from '../../src/products/dto/create-product.dto';
import { UpdateProductDto } from '../../src/products/dto/update-product.dto';
import { rid } from '../utils/rid';
import qs from 'qs';

const prefix = '/api/products';

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
    .post('/api/products')
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'multipart/form-data')
    .field(createProductDto(dto) as any);
}

export function getProducts(
  token: string,
  query: Record<string, any> = {}
): SuperAgentRequest {
  return request
    .get(`${prefix}`)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query));
}

export function getProduct(token: string, id: string): SuperAgentRequest {
  return request.get(`${prefix}/${id}`).set('Authorization', `bearer ${token}`);
}

export function updaeProduct(
  token: string,
  id: string,
  changes: UpdateProductDto
): SuperAgentRequest {
  return request
    .patch(`${prefix}/${id}`)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'multipart/form-data')
    .field((changes || {}) as any);
}

export function deleteProduct(token: string, id: string): SuperAgentRequest {
  return request
    .delete(`${prefix}/${id}`)
    .set('Authorization', `bearer ${token}`);
}

export function getTags(token: string): SuperAgentRequest {
  return request.get(`${prefix}/tags`).set('Authorization', `bearer ${token}`);
}

export function getCategories(token: string): SuperAgentRequest {
  return request
    .get(`${prefix}/category`)
    .set('Authorization', `bearer ${token}`);
}
