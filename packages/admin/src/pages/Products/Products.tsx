import React from 'react';
import { Schema$Product } from '@fullstack/typings';
import { NewProduct } from './ProductActions/NewProduct';
import { ProductsGridView } from './ProductsGridView';
import { Layout } from '../../components/Layout';
import { usePaginationLocal } from '../../hooks/usePaginationLocal';
import { getProducts } from '../../service';
import { Toaster } from '../../utils/toaster';

const onFailure = Toaster.apiError.bind(Toaster, 'Get products failure');

export function Products() {
  const {
    data,
    pageNo,
    pagination,
    params,
    actions
    //
  } = usePaginationLocal<Schema$Product, 'id'>({
    key: 'id',
    pageSize: 12,
    fn: getProducts,
    onFailure
  });

  return (
    <Layout className="products" navbar={<NewProduct onCreate={() => {}} />}>
      <ProductsGridView
        flag={pageNo + JSON.stringify(params)}
        products={data}
        pagination={pagination}
        onUpdate={actions.update}
      />
    </Layout>
  );
}
