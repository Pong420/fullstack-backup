import React from 'react';
import { Layout } from '../../components/Layout';
import { Pagination } from '../../components/Pagination';
import { NotFound } from '../../components/NonIdealState';
import { Omnibar } from '../../components/Omnibar';
import { CreateProduct } from './CreateProduct';
import { Product } from './Product';
import { useProductActions, productPaginationSelector } from '../../store';
import { getProducts } from '../../service';
import { useReduxPagination } from '../../hooks/useReduxPagination';

export function Products() {
  const { paginateProduct } = useProductActions();

  const [{ ids, search }, paginationProps] = useReduxPagination({
    fn: getProducts,
    onSuccess: paginateProduct,
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
          <Omnibar suffix="Products" />
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
