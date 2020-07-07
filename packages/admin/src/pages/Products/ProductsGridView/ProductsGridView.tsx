import React, { useEffect } from 'react';
import { Card } from '@blueprintjs/core';
import { Schema$Product } from '@fullstack/typings';
import { Pagination, PaginationProps } from '../../../components/Pagination';
import { OnUpdate } from '../ProductActions/UpdateProduct';
import { OnDelete } from '../ProductActions/DeleteProduct';
import { ProductsGrid } from './ProductsGrid';

interface Props extends OnUpdate, OnDelete {
  products: Partial<Schema$Product>[];
  pagination: PaginationProps;
  flag?: unknown;
}

export function ProductsGridView({
  flag,
  products,
  pagination,
  onUpdate,
  onDelete
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
            onDelete={onDelete}
          />
        ))}
      </div>
      <Pagination {...pagination} />
    </Card>
  );
}
