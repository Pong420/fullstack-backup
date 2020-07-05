import React from 'react';
import { Divider, Tag } from '@blueprintjs/core';
import { Schema$Product } from '@fullstack/typings';
import { setSearchParam } from '../../../utils/setSearchParam';
import { Skeleton } from '../../../components/Skeleton';
import { getTagProps } from '../../../utils/getTagProps';

interface Props {
  product: Partial<Schema$Product>;
}

function FormatPrice({
  discount,
  price
}: Pick<Schema$Product, 'price' | 'discount'>) {
  if (discount >= 100) {
    return <span>${price}</span>;
  }
  return (
    <span>
      <span>${(price * discount) / 100}</span>
      <span>(${price})</span>
    </span>
  );
}

export function ProductsGrid({ product }: Props) {
  const { images = [], tags = [], price, discount, category, remain } = product;
  return (
    <div className="product-grid">
      <Skeleton className="product-grid-image">
        {images[0] && <div style={{ backgroundImage: `url(${images[0]})` }} />}
      </Skeleton>
      <Divider />
      <div className="caption">
        <div className="product-row">
          <Skeleton className="product-name">{product.name}</Skeleton>
          <Skeleton className="product-price">
            {price && <FormatPrice price={price} discount={discount || 100} />}
          </Skeleton>
        </div>
        <div className="product-row">
          <Skeleton className="product-type">
            {category && (
              <span
                className="searchable"
                onClick={() => setSearchParam({ category })}
              >
                {category}
              </span>
            )}
          </Skeleton>
          <Skeleton className="product-amount">
            {remain && `Remain: ${remain}`}
          </Skeleton>
        </div>
        <div>
          <div className="product-actions">{/*  */}</div>
          <div className="product-tags">
            {tags.map((tag, index) => (
              <Tag
                {...getTagProps(tag, index)}
                interactive
                key={index}
                onClick={() => setSearchParam({ tag })}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
