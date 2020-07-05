import React from 'react';
import { Schema$Product } from '@fullstack/typings';
import { NewProduct } from './NewProduct';
import { ProductsGridView } from './ProductsGridView';
import { Layout } from '../../components/Layout';
import { usePaginationLocal } from '../../hooks/usePaginationLocal';
import { getProducts } from '../../service';
import { Toaster } from '../../utils/toaster';

const onFailure = Toaster.apiError.bind(Toaster, 'Get products failure');

export function Products() {
  const { data, pagination } = usePaginationLocal<Schema$Product, 'id'>({
    key: 'id',
    pageSize: 12,
    fn: getProducts,
    onFailure
  });

  return (
    <Layout className="products" navbar={<NewProduct onCreate={() => {}} />}>
      <ProductsGridView products={data} pagination={pagination} />
    </Layout>
  );
}
