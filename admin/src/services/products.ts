import { api } from './api';
import {
  Param$GetProducts,
  Param$CreateProduct,
  Param$UpdateProduct,
  Response$GetProducts,
  Response$Product,
  Response$GetSuggestion
} from '../typings';
import { createFormData } from './createFormData';

export const getProducts = (params: Param$GetProducts = {}) =>
  api.get<Response$GetProducts>('/products', { params });

export const createProduct = (params: Param$CreateProduct) =>
  api.post<Response$Product>('/products', createFormData(params));

export const updateProduct = (params: Param$UpdateProduct) => {
  return api.patch<Response$Product>(
    `/products/${params.id}`,
    createFormData(params)
  );
};

export const deleteProduct = ({ id }: { id: string }) => {
  return api.delete(`/products/${id}`);
};

export const getSuggestion = (type?: 'types' | 'tags') =>
  api.get<Response$GetSuggestion>(`/products/${type}`);
