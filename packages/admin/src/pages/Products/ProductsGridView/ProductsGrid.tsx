import React from 'react';
import { Divider, Tag } from '@blueprintjs/core';
import { Schema$Product } from '@fullstack/typings';
import { Skeleton } from '../../../components/Skeleton';
import { Image } from '../../../components/Image';
import { UpdateProduct, OnUpdate } from '../ProductActions/UpdateProduct';
import { getTagProps } from '../../../utils/getTagProps';
import { setSearchParam } from '../../../utils/setSearchParam';

interface Props extends OnUpdate {
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

export function ProductsGrid({ product, onUpdate }: Props) {
  const { images = [], tags = [], price, discount, category, remain } = product;
  return (
    <div className="product-grid">
      <Skeleton className="product-grid-image">
        {<Image src={images[0]} size={400} thumbnal background />}
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
          <div className="product-actions">
            <UpdateProduct {...product} onUpdate={onUpdate} />
          </div>
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
