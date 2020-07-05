import React from 'react';
import { Card } from '@blueprintjs/core';
import { Schema$Product } from '@fullstack/typings';
import { Pagination, PaginationProps } from '../../../components/Pagination';
import { ProductsGrid } from './ProductsGrid';

interface Props {
  products: Partial<Schema$Product>[];
  pagination: PaginationProps;
}

export function ProductsGridView({ products, pagination }: Props) {
  return (
    <Card>
      <div className="products-grid-view">
        {products.map(product => (
          <ProductsGrid key={product.id || Math.random()} product={product} />
        ))}
      </div>
      <Pagination {...pagination} />
    </Card>
  );
}
