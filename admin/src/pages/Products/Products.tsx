import React from 'react';
import { Layout } from '../../components/Layout';
import { Pagination } from '../../components/Pagination';
import { NotFound } from '../../components/NonIdealState';
import { CreateProduct } from './CreateProduct';
import { Product } from './Product';
import { useProductActions, productPaginationSelector } from '../../store';
import { getProducts } from '../../services';
import { useReduxPagination } from '../../hooks/useReduxPagination';

export function Products() {
  const { paginateProduct, resetProducts } = useProductActions();

  const [{ ids, search }, paginationProps] = useReduxPagination({
    fn: getProducts,
    onSuccess: paginateProduct,
    onReset: resetProducts,
    selector: productPaginationSelector
  });

  return (
    <Layout
      className="products"
      icon="box"
      title="Products"
      navbar={
        <>
          <CreateProduct />
        </>
      }
    >
      {search && ids.length === 0 && <NotFound />}
      <div className="products-container">
        {ids.map(id => (
          <Product id={id} key={id || Math.random()}></Product>
        ))}
      </div>
      <Pagination {...paginationProps} />
    </Layout>
  );
}
