import {
  Response$Tags,
  Response$Category,
  Param$CreateProduct,
  Response$Product,
  Response$GetProducts,
  Param$GetProducts
} from '@fullstack/typings';
import { api } from './api';
import { defer } from 'rxjs';
import { delay } from 'rxjs/operators';

export const createProduct = (payload: Param$CreateProduct) =>
  api.post<Response$Product>('/products', payload);

export const getProducts = (params?: Param$GetProducts) =>
  defer(() => api.get<Response$GetProducts>('/products', { params })).pipe(
    delay(2000)
  );

export const getProductTags = () => api.get<Response$Tags>('/products/tags');

export const getProductCategories = () =>
  api.get<Response$Category>('/products/category');
