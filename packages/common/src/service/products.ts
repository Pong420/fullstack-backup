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

function handleSpecificSearch(search: string, key: string) {
  const regex = new RegExp(`^${key}:`);
  return regex.test(search) ? { [key]: search.replace(regex, '') } : undefined;
}

export const getProducts = ({ search, ...params }: Param$GetProducts = {}) => {
  const searchParams = search
    ? handleSpecificSearch(search, ProductSuggestTypes.TAG) ||
      handleSpecificSearch(search, ProductSuggestTypes.CATEGORY) || { search }
    : {};

  return api.get<Response$GetProducts>(PATHS.GET_PRODUCTS, {
    params: { ...searchParams, ...params }
  });
};

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
