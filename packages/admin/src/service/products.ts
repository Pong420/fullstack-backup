import {
  Param$CreateProduct,
  Param$GetProducts,
  Param$Product,
  Param$UpdateProduct,
  Response$Product,
  Response$GetProducts,
  Response$Tags,
  Response$Category
} from '@fullstack/typings';
import { api } from './api';
import { createFormData } from './createFormData';

export const createProduct = (payload: Param$CreateProduct) =>
  api.post<Response$Product>('/products', createFormData(payload));

export const updateProduct = ({
  id,
  ...payload
}: Param$Product & Param$UpdateProduct) =>
  api.patch<Response$Product>(`/products/${id}`, createFormData(payload));

export const deleteProduct = ({ id }: Param$Product) =>
  api.delete<unknown>(`/products/${id}`);

export const getProducts = (params?: Param$GetProducts) =>
  api.get<Response$GetProducts>('/products', { params });

export const getProductTags = () => api.get<Response$Tags>('/products/tags');

export const getProductCategories = () =>
  api.get<Response$Category>('/products/category');
