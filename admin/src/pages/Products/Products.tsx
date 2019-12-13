import React from 'react';
import { Layout } from '../../components/Layout';
import { Pagination } from '../../components/Pagination';
import { CreateProduct } from './CreateProduct';
import { Product } from './Product';
import { useProductActions, productPaginationSelector } from '../../store';
import { getProducts } from '../../services';
import { useReduxPagination } from '../../hooks/useReduxPagination';

export function Products() {
  const { paginateProduct, setPageProduct } = useProductActions();

  const [{ ids }, paginationProps] = useReduxPagination({
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
        </>
      }
    >
      <div className="products-container">
        {ids.map(id => (
          <Product id={id} key={id || Math.random()}></Product>
        ))}
      </div>
      <Pagination {...paginationProps} onPageChange={setPageProduct} />
    </Layout>
  );
}
