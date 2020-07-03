import React from 'react';
import { Card } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { ProductForm } from './ProductForm';

export function Products() {
  return (
    <Layout className="products">
      <Card>
        <ProductForm />
      </Card>
    </Layout>
  );
}
