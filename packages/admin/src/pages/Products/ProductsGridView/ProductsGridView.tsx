import React, { useEffect } from 'react';
import { Card } from '@blueprintjs/core';
import { Schema$Product } from '@fullstack/typings';
import { Pagination, PaginationProps } from '../../../components/Pagination';
import { OnUpdate } from '../ProductActions/UpdateProduct';
import { ProductsGrid } from './ProductsGrid';

interface Props extends OnUpdate {
  products: Partial<Schema$Product>[];
  pagination: PaginationProps;
  flag?: unknown;
}

export function ProductsGridView({
  flag,
  products,
  pagination,
  onUpdate
}: Props) {
  useEffect(() => {
    document.body.scrollTop = 0;
  }, [flag]);

  return (
    <Card>
      <div className="products-grid-view">
        {products.map(product => (
          <ProductsGrid
            key={product.id || Math.random()}
            product={product}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <Pagination {...pagination} />
    </Card>
  );
}
