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

function handleSpecificSearch(search: string, reg: RegExp, key: string) {
  return reg.test(search) ? { [key]: search.replace(reg, '') } : undefined;
}

export const getProducts = ({ search, ...params }: Param$GetProducts = {}) => {
  let searchParams = search
    ? handleSpecificSearch(search, /^tag:/, 'tag') ||
      handleSpecificSearch(search, /^type:/, 'type') || { search }
    : {};

  return api.get<Response$GetProducts>('/products', {
    params: { ...searchParams, ...params }
  });
};

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
