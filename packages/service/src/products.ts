import { api } from './api';
import {
  Param$GetProducts,
  Param$CreateProduct,
  Param$UpdateProduct,
  Response$GetProducts,
  Response$Product,
  Response$GetSuggestion
} from './typings';
import { createFormData, generatePath, PATHS } from './utils';

function handleSpecificSearch(search: string, reg: RegExp, key: string) {
  return reg.test(search) ? { [key]: search.replace(reg, '') } : undefined;
}

export const getProducts = ({ search, ...params }: Param$GetProducts = {}) => {
  const searchParams = search
    ? handleSpecificSearch(search, /^tag:/, 'tag') ||
      handleSpecificSearch(search, /^type:/, 'type') || { search }
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

export const getSuggestion = (type: 'types' | 'tags') => {
  return api.get<Response$GetSuggestion>(
    type === 'types' ? PATHS.GET_SUGGESTION_TYPE : PATHS.GET_SUGGESTION_TAGS
  );
};
