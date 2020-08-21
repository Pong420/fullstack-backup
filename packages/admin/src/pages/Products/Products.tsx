import React from 'react';
import { Schema$Product } from '@fullstack/typings';
import { getProducts } from '@fullstack/common/service';
import { NewProduct } from './ProductActions/NewProduct';
import { ProductsGridView } from './ProductsGridView';
import { ProductFilter } from './ProductFilter';
import { Layout } from '../../components/Layout';
import { createUsePaginationLocal } from '../../hooks/usePaginationLocal';
import { Toaster } from '../../utils/toaster';

const onFailure = Toaster.apiError.bind(Toaster, 'Get products failure');

const useProductPagination = createUsePaginationLocal<Schema$Product, 'id'>(
  'id',
  getProducts
);

const pageSize = 12;

export function Products() {
  const { data, pageNo, pagination, params, actions } = useProductPagination({
    pageSize,
    onFailure
  });

  return (
    <Layout
      className="products"
      navbar={
        <>
          <NewProduct onCreate={actions.create} />
          <ProductFilter initialValues={params} />
        </>
      }
    >
      <ProductsGridView
        flag={pageNo + JSON.stringify(params)}
        products={data}
        pagination={pagination}
        onUpdate={actions.update}
        onDelete={actions.delete}
      />
    </Layout>
  );
}
