import React from 'react';
import { Card } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { NewProduct } from './NewProduct';

export function Products() {
  return (
    <Layout className="products" navbar={<NewProduct onCreate={() => {}} />}>
      <Card />
    </Layout>
  );
}
