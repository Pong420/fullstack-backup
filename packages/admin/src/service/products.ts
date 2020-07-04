import {
  Response$Tags,
  Response$Category,
  Param$CreateProduct,
  Response$Product
} from '@fullstack/typings';
import { api } from './api';

export const createProduct = (payload: Param$CreateProduct) =>
  api.post<Response$Product>('/products', payload);

export const getProductTags = () => api.get<Response$Tags>('/products/tags');

export const getProductCategories = () =>
  api.get<Response$Category>('/products/category');
