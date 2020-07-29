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
import { paths } from '../constants';
import { api } from './api';

const image: keyof Param$CreateProduct & keyof Param$UpdateProduct = 'images';

export const createProduct = (payload: Param$CreateProduct) =>
  api.post<Response$Product>(paths.create_product, payload, { image });

export const updateProduct = ({
  id,
  ...payload
}: Param$Product & Param$UpdateProduct) =>
  api.patch<Response$Product>(
    paths.update_product.generatePath({ id }),
    payload,
    { image }
  );

export const deleteProduct = ({ id }: Param$Product) =>
  api.delete<unknown>(paths.delete_product.generatePath({ id }));

export const getProducts = (params?: Param$GetProducts) =>
  api.get<Response$GetProducts>(paths.get_products, { params });

export const getProductTags = () =>
  api.get<Response$Tags>(paths.get_product_tags);

export const getProductCategories = () => {
  return api.get<Response$Category>(paths.get_product_category);
};
