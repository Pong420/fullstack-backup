import React from 'react';
import { Layout } from '../../components/Layout';
import { CreateProduct } from './CreateProduct';

export function Products() {
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
    ></Layout>
  );
}
