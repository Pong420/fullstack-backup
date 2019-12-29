import { api } from './api';
import {
  Param$GetProducts,
  Param$CreateProduct,
  Param$UpdateProduct,
  Response$GetProducts,
  Response$Product,
  Response$GetSuggestion,
  ProductSuggestTypes
} from './typings';
import { createFormData, generatePath, PATHS } from './utils';

export const getProducts = (params: Param$GetProducts = {}) =>
  api.get<Response$GetProducts>(PATHS.GET_PRODUCTS, { params });

export const createProduct = (params: Param$CreateProduct) =>
  api.post<Response$Product>(PATHS.CREATE_PRODUCT, createFormData(params));

export const updateProduct = ({ id, ...params }: Param$UpdateProduct) => {
  return api.patch<Response$Product>(
    generatePath(PATHS.UPDATE_PRODUCT, { id }),
    createFormData(params)
  );
};

export const deleteProduct = ({ id }: { id: string }) => {
  return api.delete(generatePath(PATHS.DELETE_PRODUCT, { id }));
};

export const getSuggestion = (type: ProductSuggestTypes) => {
  return api.get<Response$GetSuggestion>(
    type === ProductSuggestTypes['CATEGORY']
      ? PATHS.GET_SUGGESTION_CATEGORY
      : PATHS.GET_SUGGESTION_TAGS
  );
};
